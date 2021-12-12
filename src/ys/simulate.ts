import calculate from "./calculate";
import { emptyArtifactStat, getArtifactStat, randFullMinors } from "./rand_artifact";
import Preset from "./types/Preset";
import { ArtifactBonusStat } from "./types/Stat";
import data from "./data/artifact"
import choice from "./utils/choice";
import { Model } from "./learn";
import { MainAffixes, MinorAffix } from "./types/Artifact";

interface Bag {
    [type: string]: {
        s: number
        ms: MinorAffix[]
    }
}

function simulateOne(p: Preset, ab: ArtifactBonusStat, mains: MainAffixes, model: Model, N: number) {
    let bag: Bag = {
        flower: { s: null, ms: [] },
        plume: { s: null, ms: [] },
        sands: { s: null, ms: [] },
        goblet: { s: null, ms: [] },
        circlet: { s: null, ms: [] }
    }
    let vs = [calculate(p, ab, emptyArtifactStat())]
    for (let i = 0; i < N; ++i) {
        let type = choice(data.types) as keyof MainAffixes
        let mainKey = mains[type]
        let pr = data.main[type][mainKey].p
        if (Math.random() > pr) {
            vs.push(vs[vs.length - 1])
            continue
        }
        let ms = randFullMinors(mainKey)
        let s = model.score(ms)
        if (bag[type].s !== null && s <= bag[type].s) {
            vs.push(vs[vs.length - 1])
            continue
        }
        bag[type].s = s
        bag[type].ms = ms
        let tmpMains: MainAffixes = {}
        let msAll: MinorAffix[] = []
        for (let type in bag) {
            if (bag[type].s !== null) {
                msAll = msAll.concat(bag[type].ms)
                tmpMains[type] = mains[type]
            }
        }
        let a = getArtifactStat(tmpMains, msAll)
        let v = calculate(p, ab, a)
        vs.push(v)
    }
    return vs
}

function sq(n: number): number {
    return n * n
}

interface SimulationResult {
    [key: string]: any[]
}

export default function simulate(p: Preset, ab: ArtifactBonusStat, mains: MainAffixes, model: Model, N: number, T: number): SimulationResult {
    let sims = []
    for (let i = 0; i < T; ++i) {
        let vs = simulateOne(p, ab, mains, model, N)
        sims.push(vs)
    }
    let clb = [], avg = [], cub = []
    for (let i = 0; i < N; ++i) {
        let s1 = 0, s2 = 0
        for (let j = 0; j < T; ++j) {
            s1 += sims[j][i]
            s2 += sq(sims[j][i])
        }
        let mu = s1 / T
        let d = 1.96 * Math.sqrt((s2 - sq(s1) / T) / (T * (T - 1)))
        clb.push(mu - d)
        avg.push(mu)
        cub.push(mu + d)
    }
    return { clb, avg, cub }
}

export function simulationChart(p: Preset, ab: ArtifactBonusStat, mains: MainAffixes, model: Model, resin: number, T: number, v: number) {
    let N = Math.floor(resin / 20 * 1.1)
    let { clb, avg, cub } = simulate(p, ab, mains, model, N, T)
    let labels = [], cur = []
    for (let i = 0; i < avg.length; ++i) {
        labels.push(((i * 20) / 1.1).toFixed(0));
        cur.push(v);
    }
    return {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "95%置信下界",
                    data: clb,
                    borderWidth: 1,
                    fill: false,
                    borderColor: "transparent"
                },
                {
                    label: "成长期望",
                    data: avg,
                    borderWidth: 1,
                    borderColor: "#00768a",
                    fill: false,
                },
                {
                    label: "95%置信上界",
                    data: cub,
                    borderWidth: 1,
                    fill: "-2",
                    backgroundColor: '#00800020',
                    borderColor: "transparent"
                },
                {
                    label: "当前数值",
                    data: cur,
                    borderColor: "red",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            elements: {
                point: {
                    radius: 0,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "体力",
                    },
                },
            },
            maintainAspectRatio: false,
        },
    }
}