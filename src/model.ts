import { parse as parseAst, visit, ASTKindToNode, SelectionSetNode } from 'graphql';
import type { FieldNode, ASTNode } from 'graphql'

interface Entity {
    name: string
    fields: [string?],
    entities: Map<string, Entity>,
    filters: [Filter?]
}

type ScalarType = string | number | boolean
type ScalarTypeArray = [ScalarType?]

interface Filter {
    key: string,
    value: ScalarType | ScalarTypeArray | Filter
}

function NewEntity(name: string) : Entity {
    return {
        name,
        fields: [],
        entities: new Map(),
        filters: []
    }
}

export function parse(query: string) : Map<string, Entity> {
    const ast = parseAst(query, { noLocation: true })

    const parsed: Map<string, Entity> = new Map()

    visit(ast, {
        SelectionSet: {
            enter(node, _key, _parent, path, ancestors) {
                node.selections.forEach(selectionNode => {
                    if (selectionNode.kind == "Field") {
                        // console.log(isInsideQuery(ancestors), ancestors)
                        const fieldNode = selectionNode as FieldNode
                        
                        const hierarchy = [...getAncestorsArray(ancestors, path), fieldNode.name.value]
                        // console.log("hierarchy: ", hierarchy)

                        if (fieldNode.arguments?.length == 0 && !selectionNode.selectionSet) {
                            // Leaf node, represents fields to fetch.
                            hierarchy.pop()
                            let entity = parsed.get(hierarchy[0])
                            hierarchy.shift()
                            for (let e of hierarchy) {
                                entity = entity?.entities.get(e)
                            }
                            
                            entity?.fields.push(fieldNode.name.value)
                        } else {
                            
                            const entity = NewEntity(hierarchy[hierarchy.length - 1])
                            // console.log("New entity:", entity.name)

                            if (hierarchy.length == 1) {
                                parsed.set(hierarchy[0], entity)
                            } else {
                                hierarchy.pop()
                                let parent = parsed.get(hierarchy[0])
                                hierarchy.shift()
                                for (let e of hierarchy) {
                                    parent = parent?.entities.get(e)
                                }
                                parent?.entities.set(entity.name, entity)
                            }
                            
                        } 
                    }
                })
            }
        }
    })
    return parsed
}

function isInsideQuery(ancestors: ReadonlyArray<ASTNode | ReadonlyArray<ASTNode>>) : boolean {
    for(let ancestor of ancestors) {
        if (ancestor instanceof Array) {
            if (isInsideQuery(ancestor)) {
                return true
            }
        } else {
            if (ancestor.kind == "OperationDefinition") {
                if (ancestor.operation == "query") {
                    return true
                }
            }
        }
        
    }
    return false
}

function getAncestorsArray(ancestors: ReadonlyArray<ASTNode | ReadonlyArray<ASTNode>>, path: readonly (string|number)[] ) : Array<string> {
    let ret: Array<string> = []
    let index = path.length - 1
    let ancestorsReversed = ancestors.slice().reverse()
    let i = index
    for (let ancestor of ancestorsReversed) {
        // console.log(ancestor)
        if (ancestor instanceof Array) {
            continue
        // } else if (ancestor.kind == "Field") {
        //     ret.push(ancestor.name.value)
        } else if (ancestor.kind == "SelectionSet") {
                
            if(i > 2) {
                let selectionIndex = path[i - 1] as number
                let parent = ancestor.selections[selectionIndex]
                // if (!parent) {
                //     console.log(ancestorsReversed, path, ancestor, selectionIndex, i)
                // }
                if (parent.kind == "Field") {
                    ret.unshift(parent.name.value)
                }
                i-=3
            }
            // return ret
        }
    }

    return ret
}

export type {
    Entity
}

// key, parent, path, ancestors