/**
 * A Lengthy store
 * @todo split into modules
 */

import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import Preset from '../ys/types/Preset'
import loc from "../locale/chs"
import formulas from '../ys/formulas'
import StatParams from "../ys/stat_params"
import { ArtifactBonusStat, BaseStat, CharacterBasicStat, EnemyStat } from '../ys/types/Stat'
import calculate from '../ys/calculate'
import buffs from '../ys/buffs'
import Buff from '../ys/types/Buff'
import { MainAffixes } from '../ys/types/Artifact'
import { EnumParam } from '../ys/types/Param'

const mainAffixKeys = <{ [type: string]: string[] }>{
    flower: ['hp'],
    plume: ['atk'],
    sands: ['hpp', 'atkp', 'defp', 'em', 'er'],
    goblet: ['hpp', 'atkp', 'defp', 'em', 'pyroDB', 'hydroDB', 'electroDB', 'anemoDB', 'cryoDB', 'geoDB', 'physicalDB'],
    circlet: ['hpp', 'atkp', 'defp', 'em', 'cr', 'cd', 'hb'],
}

export interface State {
    preset: Preset,
    ab: ArtifactBonusStat,
    mains: MainAffixes,
    learn: {
        [type: string]: number
    }
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: () => ({
        preset: {
            title: '未命名的预设',
            formula: {
                id: 'sim_dmg',
                params: ['pyro', 'avg']
            },
            stat: {
                base: {
                    key: 'atk',
                    multiplier: 1,
                    addend: 0
                },
                character: {
                    lv: 90,
                    hp: 0,
                    baseHP: 0,
                    atk: 0,
                    baseATK: 0,
                    def: 0,
                    baseDEF: 0,
                    em: 0,
                    stamina: 240,
                    cr: 0.05,
                    cd: 0.5,
                    hb: 0,
                    ihb: 0,
                    er: 0,
                    cdr: 0,
                    ss: 0,
                    pyroDB: 0,
                    pyroRES: 0,
                    hydroDB: 0,
                    hydroRES: 0,
                    dendroDB: 0,
                    dendroRES: 0,
                    electroDB: 0,
                    electroRES: 0,
                    anemoDB: 0,
                    anemoRES: 0,
                    cryoDB: 0,
                    cryoRES: 0,
                    geoDB: 0,
                    geoRES: 0,
                    physicalDB: 0,
                    physicalRES: 0
                },
                enemy: {
                    lv: 100,
                    pyroRES: 0.1,
                    hydroRES: 0.1,
                    dendroRES: 0.1,
                    electroRES: 0.1,
                    anemoRES: 0.1,
                    cryoRES: 0.1,
                    geoRES: 0.1,
                    physicalRES: 0.1,
                    res: 0.1
                }
            },
            buffs: []
        },
        ab: {
            hp: 0,
            atk: 0,
            def: 0,
            em: 0,
            stamina: 0,
            cr: 0,
            cd: 0,
            hb: 0,
            ihb: 0,
            er: 0,
            cdr: 0,
            ss: 0,
            pyroDB: 0,
            pyroRES: 0,
            hydroDB: 0,
            hydroRES: 0,
            dendroDB: 0,
            dendroRES: 0,
            electroDB: 0,
            electroRES: 0,
            anemoDB: 0,
            anemoRES: 0,
            cryoDB: 0,
            cryoRES: 0,
            geoDB: 0,
            geoRES: 0,
            physicalDB: 0,
            physicalRES: 0,
        },
        mains: {
            flower: 'hp',
            plume: 'atk',
            sands: 'atkp',
            goblet: 'pyroDB',
            circlet: 'cr'
        },
        learn: {
            trainSize: 10000,
            resin: 20000,
            niter: 10
        }
    }),
    getters: {
        calculation(state) {
            return calculate(state.preset).toFixed(0)
        },
        formula(state) {
            return {
                name: '目标函数',
                param: {
                    type: 'enum',
                    value: state.preset.formula.id,
                    items: ['sim_dmg', 'amp_dmg'].map(x => ({ key: x, text: loc.formula[x].name })),
                },
                payload: {
                    type: 'changeFormula',
                }
            }
        },
        formulaParams(state) {
            return formulas[state.preset.formula.id].params.map((x, i) => ({
                name: loc.formula[state.preset.formula.id].params[i],
                param: {
                    type: 'enum',
                    value: state.preset.formula.params[i],
                    items: x.from.map(y => ({ key: y, text: loc.param[y] }))
                },
                payload: {
                    type: 'changeFormulaParams',
                    index: i
                }
            }))
        },
        statBase(state) {
            return ['key', 'multiplier', 'addend'].map(x => ({
                name: loc.base[x],
                param: {
                    type: StatParams[x].type,
                    value: state.preset.stat.base[x as keyof BaseStat],
                    items: StatParams[x].type === 'enum' ?
                        (StatParams[x] as EnumParam).from.map(y => ({ key: y, text: loc.stat[y] })) : undefined
                },
                payload: {
                    type: 'changeStatBase',
                    key: x
                }
            }))
        },
        statCharacter(state) {
            return ['lv', 'baseHP', '_hp', 'baseATK', '_atk', 'baseDEF', '_def', 'em', 'stamina', 'cr', 'cd', 'hb', 'ihb', 'er', 'cdr', 'ss', 'pyroDB', 'pyroRES', 'hydroDB', 'hydroRES', 'dendroDB', 'dendroRES', 'electroDB', 'electroRES', 'anemoDB', 'anemoRES', 'cryoDB', 'cryoRES', 'geoDB', 'geoRES', 'physicalDB', 'physicalRES'].map(x => {
                let ret = {
                    name: '',
                    param: {
                        type: '',
                        value: 0
                    },
                    payload: {
                        type: 'changeStatCharacter',
                        key: x
                    }
                }
                if (x[0] == '_') {
                    let key = x.slice(1) as keyof CharacterBasicStat
                    let baseKEY = 'base' + key.toUpperCase() as keyof CharacterBasicStat
                    ret.name = '绿字' + loc.stat[key]
                    ret.param.type = 'basic'
                    ret.param.value = state.preset.stat.character[key] - state.preset.stat.character[baseKEY]
                } else {
                    ret.name = loc.stat[x]
                    ret.param.type = StatParams[x].type
                    ret.param.value = state.preset.stat.character[x as keyof CharacterBasicStat]
                }
                return ret
            })
        },
        statEnemy(state) {
            return ['lv', 'pyroRES', 'hydroRES', 'dendroRES', 'electroRES', 'anemoRES', 'cryoRES', 'geoRES', 'physicalRES', 'res'].map(x => ({
                name: loc.stat[x],
                param: {
                    type: StatParams[x].type,
                    value: state.preset.stat.enemy[x as keyof EnemyStat]
                },
                payload: {
                    type: 'changeStatEnemy',
                    key: x
                }
            }))
        },
        buffTypes(state) {
            return ['add', 'add_%', 'add_base', 'add_by', 'add_by_%', 'add_by_up', 'add_by_up_%'].map(x => ({
                key: x,
                text: loc.buff[x].name
            }))
        },
        buffs(state) {
            return state.preset.buffs.map((x, i) => {
                let ret: any = {};
                ['on', 'title'].forEach(key => {
                    ret[key] = {
                        value: x[key as keyof Buff],
                        payload: {
                            type: 'changeBuff',
                            index: i,
                            key
                        }
                    }
                });
                ret.params = buffs[x.id].params.map((y, j) => ({
                    name: loc.buff[x.id].params[j],
                    param: {
                        type: y.type,
                        value: x.params[j],
                        items: y.type === 'enum' ? y.from.map(z => ({ key: z, text: loc.stat[z] })) : undefined
                    },
                    payload: {
                        type: 'changeBuffParam',
                        buffIndex: i,
                        paramIndex: j
                    }
                }))
                return ret
            })
        },
        abParams(state) {
            return ['hp', 'atk', 'def', 'em', 'stamina', 'cr', 'cd', 'hb', 'ihb', 'er', 'cdr', 'ss', 'pyroDB', 'pyroRES', 'hydroDB', 'hydroRES', 'dendroDB', 'dendroRES', 'electroDB', 'electroRES', 'anemoDB', 'anemoRES', 'cryoDB', 'cryoRES', 'geoDB', 'geoRES', 'physicalDB', 'physicalRES'].map(x => ({
                name: '+' + loc.stat[x],
                param: {
                    type: StatParams[x].type,
                    value: state.ab[x as keyof ArtifactBonusStat]
                },
                payload: {
                    type: 'changeAbParam',
                    key: x
                }
            }))
        },
        mainAffixes(state) {
            return ['flower', 'plume', 'sands', 'goblet', 'circlet'].map(x => ({
                name: loc.artifact[x],
                param: {
                    type: 'enum',
                    value: state.mains[x as keyof MainAffixes],
                    items: mainAffixKeys[x].map(y => ({ key: y, text: loc.stat[y] }))
                },
                payload: {
                    type: 'changeMainAffix',
                    key: x
                }
            }))
        },
        learnParams(state) {
            return ['trainSize', 'resin', 'niter'].map(x => ({
                name: loc.learn[x],
                param: {
                    type: 'basic',
                    value: state.learn[x]
                },
                payload: {
                    type: 'changeLearnParam',
                    key: x
                }
            }))
        }
    },
    mutations: {
        changeFormula(state, payload) {
            state.preset.formula.id = payload.value
            state.preset.formula.params = formulas[payload.value].params.map(x => x.default)
        },
        changeFormulaParams(state, payload) {
            state.preset.formula.params[payload.index] = payload.value
        },
        changeStatBase(state, payload) {
            let key = payload.key as keyof BaseStat
            (state.preset.stat.base[key] as any) = payload.value
        },
        changeStatCharacter(state, payload) {
            if (payload.key[0] == '_') {
                let key = payload.key.slice(1) as keyof CharacterBasicStat
                let baseKEY = 'base' + key.toUpperCase() as keyof CharacterBasicStat
                state.preset.stat.character[key] = state.preset.stat.character[baseKEY] + payload.value
            } else if (['baseHP', 'baseATK', 'baseDEF'].includes(payload.key)) {
                let baseKEY = payload.key as keyof CharacterBasicStat
                let key = baseKEY.slice(4).toLowerCase() as keyof CharacterBasicStat
                state.preset.stat.character[key] += payload.value - state.preset.stat.character[baseKEY]
                state.preset.stat.character[baseKEY] = payload.value
            } else {
                state.preset.stat.character[payload.key as keyof CharacterBasicStat] = payload.value
            }
        },
        changeStatEnemy(state, payload) {
            state.preset.stat.enemy[payload.key as keyof EnemyStat] = payload.value
        },
        changeBuff(state, payload) {
            (state.preset.buffs[payload.index][payload.key as keyof Buff] as any) = payload.value
        },
        changeBuffParam(state, payload) {
            state.preset.buffs[payload.buffIndex].params[payload.paramIndex] = payload.value
        },
        addBuff(state, id) {
            state.preset.buffs.push({
                id,
                on: true,
                title: '未命名的BUFF',
                params: buffs[id].params.map(x => x.default)
            })
        },
        delBuff(state, index) {
            state.preset.buffs.splice(index, 1)
        },
        setPresetTitle(state, title) {
            state.preset.title = title
        },
        changeAbParam(state, payload) {
            state.ab[payload.key as keyof ArtifactBonusStat] = payload.value
        },
        changeMainAffix(state, payload) {
            state.mains[payload.key as keyof MainAffixes] = payload.value
        },
        changeLearnParam(state, payload) {
            state.learn[payload.key] = payload.value
        },
        setState(state, s: State) {
            state.preset = s.preset
            state.ab = s.ab
            state.mains = s.mains
            state.learn = s.learn
        },
    }
})

export function useStore() {
    return baseUseStore(key)
}