<script setup lang="ts">
import { ref } from "@vue/reactivity";
import ParamInput from "../components/ParamInput.vue";
import { useStore } from "../store"
import learn from "../ys/learn";
import Chart from 'chart.js/auto';
import chs from "../locale/chs";
import { simulationChart } from "../ys/simulate";

const store = useStore()

const loc = ref('ab')
const locs = [
    { id: "ab", name: "圣遗物面板" },
    { id: "mains", name: "主词条" },
    { id: "learn", name: "学习参数" },
]

const change = (value: any, payload: any) => {
    store.commit({
        ...payload,
        value
    })
}
const show = ref(false)
let weightCode = ref("")

let weightChart = undefined, gradChart = undefined
const start = () => {
    const model = learn(store.state.preset, store.state.ab, store.state.mains, store.state.learn.trainSize)
    weightCode.value = JSON.stringify(model.normalized())
    if (weightChart) {
        weightChart.destroy()
    }
    let ctx = document.getElementById('weight-chart') as HTMLCanvasElement
    weightChart = new Chart(ctx, model.chart())
    if (gradChart) {
        gradChart.destroy()
    }
    ctx = document.getElementById('grad-chart') as HTMLCanvasElement
    let cfg = simulationChart(store.state.preset, store.state.ab, store.state.mains, model, store.state.learn.resin, store.state.learn.niter, store.getters.calculation)
    // @ts-ignore
    gradChart = new Chart(ctx, cfg)
    show.value = true
}
</script>

<template>
    <div class="root">
        <div class="predict-container">
            <div class="panel">
                <div class="pabel-navs">
                    <span
                        v-for="l in locs"
                        :class="{ 'panel-nav-to': true, on: l.id == loc }"
                        @click="loc = l.id"
                    >{{ l.name }}</span>
                </div>
                <div class="panel-content">
                    <div v-if="loc === 'ab'">
                        <div class="param-row" v-for="p in store.getters.abParams">
                            <span>{{ p.name }}</span>
                            <param-input
                                :type="p.param.type"
                                :value="p.param.value"
                                @change="change($event, p.payload)"
                            />
                        </div>
                    </div>
                    <div v-else-if="loc === 'mains'">
                        <div class="param-row" v-for="p in store.getters.mainAffixes">
                            <span>{{ p.name }}</span>
                            <param-input
                                :type="p.param.type"
                                :value="p.param.value"
                                :items="p.param.items"
                                @change="change($event, p.payload)"
                            />
                        </div>
                    </div>
                    <div v-else-if="loc === 'learn'">
                        <div class="param-row" v-for="p in store.getters.learnParams">
                            <span>{{ p.name }}</span>
                            <param-input
                                :type="p.param.type"
                                :value="p.param.value"
                                @change="change($event, p.payload)"
                            />
                        </div>
                    </div>
                    <div v-else>?</div>
                </div>
            </div>
            <div class="divider">
                <div class="hor"></div>
                <div class="button" @click="start">开始计算</div>
                <div class="hor"></div>
            </div>
            <div v-show="show">
                <div>圣遗物副词条最优权重</div>
                <div class="comment">由于训练集随机生成，结果可能有细微差异，训练集越大结果越精确</div>
                <div class="chart-container">
                    <canvas id="weight-chart" />
                </div>
                <div>圣遗物-体力成长曲线</div>
                <div class="comment">迭代次数越多，结果越精确</div>
                <div class="chart-container">
                    <canvas id="grad-chart" />
                </div>
                <div>
                    复制以下代码到“
                    <a href="https://ideless.github.io/artifact">圣遗物强化助手</a>
                    > 词条权重 > 高级”，为当前角色配装和挑选胚子
                </div>
                <code>{{ weightCode }}</code>
            </div>
        </div>
    </div>
</template>

<style scoped>
.root {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #444;
    user-select: none;
    padding: 20px 0;
    overflow: auto;
}
.predict-container {
    margin-left: auto;
    margin-right: auto;
    width: 800px;
    max-width: 100%;
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 0 4px 0 #0007;
    padding: 10px 20px;
}
.panel {
    overflow: hidden;
}
.panel-nav-to {
    display: inline-block;
    padding: 8px 8px;
    margin-right: 24px;
    color: #0076a8;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
}
.panel-nav-to.on {
    box-shadow: inset 0 -3px 0 0 #0076a8;
}
.panel-content {
    margin: 5px;
    height: 500px;
    overflow: auto;
}
.divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
}
.hor {
    flex: 1;
    height: 1px;
    border-bottom: 1px solid lightgray;
}
.param-row {
    padding: 5px;
    display: flex;
}
.param-row:hover {
    background-color: #0001;
}
.param-row > span {
    flex: 1;
}
.button {
    display: inline-flex;
    height: 28px;
    background-color: #0076a8;
    box-shadow: 0 0 2px 0 #0007;
    border-radius: 3px;
    align-items: center;
    user-select: none;
    padding: 0 10px;
    color: white;
    cursor: pointer;
    margin: 0 10px;
}
.button:hover {
    filter: brightness(1.2);
}
.comment {
    font-size: 12px;
    color: gray;
}
.comment::before {
    content: "· ";
}
.chart-container {
    height: 400px;
}
code {
    background: #f4f4f4;
    border: 1px solid #ddd;
    color: #666;
    page-break-inside: avoid;
    font-family: monospace;
    font-size: 15px;
    line-height: 1.6;
    max-width: 100%;
    overflow: auto;
    padding: 1em 1.5em;
    display: block;
    word-wrap: break-word;
    border-radius: 5px;
    margin: 20px;
    user-select: text;
}
@media screen and (max-width: 800px) {
    .root {
        padding: unset;
        overflow: unset;
    }
    .predict-container {
        border-radius: unset;
        box-shadow: unset;
        margin: unset;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        overflow: auto;
    }
}
</style>