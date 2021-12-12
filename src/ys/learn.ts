import MLR from "ml-regression-multivariate-linear"

import { MainAffixes, MinorAffix } from "./types/Artifact";
import Preset from "./types/Preset";
import { ArtifactBonusStat } from "./types/Stat";
import data from "./data/artifact"
import { randFullMinors, getArtifactStat } from "./rand_artifact"
import calculate from "./calculate";

import chs from "../locale/chs";

// Index of minor affix in input vector
const MinorAffixIndex = {
    hp: 0,
    atk: 1,
    def: 2,
    hpp: 3,
    atkp: 4,
    defp: 5,
    em: 6,
    er: 7,
    cr: 8,
    cd: 9
}

/**
 * Run randFullMinors() 5 times
 * @returns Concated minor affixes
 */
function rand5minors(mains: MainAffixes): MinorAffix[] {
    let ret: MinorAffix[] = []
    for (let type in mains) {
        ret = ret.concat(randFullMinors(mains[type as keyof MainAffixes] as string))
    }
    return ret
}

/**
 * Convert minors to input vector, according to MinorAffixIndex
 * @param ms Minor affixes
 * @returns Input vector (10 dims)
 */
function minors2input(ms: MinorAffix[]): number[] {
    let x = Array(10).fill(0)
    for (let m of ms) {
        let i = MinorAffixIndex[m.key]
        x[i] += m.value / data.minor.vals[m.key]
    }
    return x
}

interface NormalizedWeights {
    [key: string]: number
}
interface ChartData {
    [key: string]: any[]
}

export class Model {
    w = Array(10).fill(0)
    constructor(w: number[]) {
        this.w = w
    }
    normalized(): NormalizedWeights {
        let ret: NormalizedWeights = {}
        let max = this.w.reduce((l, c) => Math.max(l, c), 0)
        for (let key in MinorAffixIndex) {
            ret[key] = Math.max(this.w[(MinorAffixIndex as any)[key]], 0)
            if (max > 0) {
                ret[key] /= max
                ret[key] = Math.floor(ret[key] * 100 + 0.5) / 100
            }
        }
        return ret
    }
    score(minors: MinorAffix[]): number {
        let x = minors2input(minors)
        let s = 0
        for (let i = 0; i < 10; ++i) {
            s += x[i] * this.w[i]
        }
        return s
    }
    chart() {
        let config: any = {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: '副词条权重',
                    data: []
                }]
            },
            options: {
                elements: {
                    bar: {
                        backgroundColor: '#0076a850'
                    }
                },
                maintainAspectRatio: false,
            }
        }
        let max = this.w.reduce((l, c) => Math.max(l, c), 0)
        if (max == 0) {
            return config
        }
        let zipped = []
        for (let key in MinorAffixIndex) {
            let val = this.w[(MinorAffixIndex as any)[key]] / max
            if (val >= 0.01) {
                zipped.push({ key: chs.stat[key], val })
            }
        }
        zipped.sort((a, b) => b.val - a.val)
        config.data.labels = zipped.map(x => x.key)
        config.data.datasets[0].data = zipped.map(x => x.val)
        return config
    }
}

/**
 * Linear regression of minor affix weights
 * @param p Preset
 * @param ab Artifact bonus stat
 * @param mains Main affixes
 * @param N Size of training set
 * @returns Weights vector (10 dims)
 */
export default function (p: Preset, ab: ArtifactBonusStat, mains: MainAffixes, N: number): Model {
    let X = [], y = []
    for (let _ = 0; _ < N; ++_) {
        let ms = rand5minors(mains)
        let x = minors2input(ms)
        let a = getArtifactStat(mains, ms)
        let v = calculate(p, ab, a)
        X.push(x)
        y.push([v])
    }
    const model = new MLR(X, y)
    let w = []
    for (let i = 0; i < model.weights.length - 1; ++i) {
        w.push(model.weights[i][0])
    }
    return new Model(w)
}