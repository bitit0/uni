<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";
import ParamInput from "../components/ParamInput.vue";
import CheckBox from "../components/CheckBox.vue";
import TextInput from "../components/TextInput.vue";
import InputDialog from "../components/InputDialog.vue";
import CopyDialog from "../components/CopyDialog.vue";
import { useStore } from "../store"
import base64 from "../vendors/base64";

const store = useStore()

const loc = ref('formula')
const locs = [
    { id: "formula", name: "目标" },
    { id: "stat", name: "面板" },
    { id: "buff", name: "BUFF" },
]

const change = (value: any, payload: any) => {
    store.commit({
        ...payload,
        value
    })
}

const bid = ref('add')

const showImportDialog = ref(false)
const importPreset = (url: string) => {
    if (url.substring(0, 6) == 'uni://') {
        let json = base64.decode(url.slice(6))
        let p = JSON.parse(json)
        store.commit('setState', p)
    }
}
const showExportDialog = ref(false)
const presetUrl = computed(() => {
    let obj = {
        version: "1",
        ...store.state
    }
    let json = JSON.stringify(obj)
    let b = base64.encode(json)
    return "uni://" + b
})
</script>


<template>
    <div class="root">
        <div class="calc-container">
            <div class="calc-header">
                <text-input
                    class="preset-title"
                    :value="store.state.preset.title"
                    @change="store.commit('setPresetTitle', $event)"
                />
                <div class="imp-exp-containter">
                    <span class="link" @click="showImportDialog = true">导入预设</span>
                    <span
                        class="link"
                        @click="showExportDialog = true"
                        style="margin-left: 10px"
                    >导出预设</span>
                    <img src="/assets/import.svg" @click="showImportDialog = true" />
                    <img
                        src="/assets/export.svg"
                        @click="showExportDialog = true"
                        style="margin-left: 5px"
                    />
                </div>
            </div>
            <div class="calc">
                <div class="result">{{ store.getters.calculation }}</div>
                <div class="panel">
                    <div class="panel-navs">
                        <span
                            v-for="l in locs"
                            :class="{ 'panel-nav-to': true, on: l.id == loc }"
                            @click="loc = l.id"
                        >{{ l.name }}</span>
                    </div>
                    <div class="panel-content">
                        <div v-if="loc == 'formula'">
                            <div class="subtitle">函数</div>
                            <div class="comment">“护盾吸收量”和“治疗量”函数将在后续添加。</div>
                            <div class="param-row">
                                <span>{{ store.getters.formula.name }}</span>
                                <param-input
                                    type="enum"
                                    :value="store.getters.formula.param.value"
                                    :items="store.getters.formula.param.items"
                                    @change="change($event, store.getters.formula.payload)"
                                />
                            </div>
                            <div class="subtitle">参数</div>
                            <div class="param-row" v-for="p in store.getters.formulaParams">
                                <span>{{ p.name }}</span>
                                <param-input
                                    type="enum"
                                    :value="p.param.value"
                                    :items="p.param.items"
                                    @change="change($event, p.payload)"
                                />
                            </div>
                        </div>
                        <div v-else-if="loc == 'stat'">
                            <div class="subtitle">基础乘区</div>
                            <div class="comment">基础乘区 = 倍率 * 攻/生/防 + 加性常数。</div>
                            <div class="comment">如果基础乘区还依赖其他量（例如胡桃的E），请在Buff中添加。</div>
                            <div class="param-row" v-for="p in store.getters.statBase">
                                <span>{{ p.name }}</span>
                                <param-input
                                    :type="p.param.type"
                                    :value="p.param.value"
                                    :items="p.param.items"
                                    @change="change($event, p.payload)"
                                />
                            </div>
                            <div class="subtitle">角色面板</div>
                            <div class="comment">元素共鸣等Buff可能会影响面板，如果这不是想要的，先消除所有Buff。</div>
                            <div class="comment">觉得不重要的参数可以不填。</div>
                            <div class="param-row" v-for="p in store.getters.statCharacter">
                                <span>{{ p.name }}</span>
                                <param-input
                                    :type="p.param.type"
                                    :value="p.param.value"
                                    @change="change($event, p.payload)"
                                />
                            </div>
                            <div class="subtitle">怪物面板</div>
                            <div class="comment">
                                <a
                                    href="https://wiki.biligame.com/ys/%E6%80%AA%E7%89%A9%E6%8A%97%E6%80%A7%E4%B8%80%E8%A7%88"
                                    target="_blank"
                                >抗性速查表</a>
                            </div>
                            <div class="param-row" v-for="p in store.getters.statEnemy">
                                <span>{{ p.name }}</span>
                                <param-input
                                    :type="p.param.type"
                                    :value="p.param.value"
                                    @change="change($event, p.payload)"
                                />
                            </div>
                        </div>
                        <div v-else-if="loc == 'buff'">
                            <div class="comment">
                                请添加
                                <b>未体现在面板上</b>的Buff，例如攻击时触发的Buff。
                            </div>
                            <div class="comment">Buff自上向下依次叠加，注意顺序。</div>
                            <div class="comment">更多说明见“关于”。</div>
                            <div class="buff" v-for="(b,i) in store.getters.buffs">
                                <div class="buff-header">
                                    <check-box
                                        :value="b.on.value"
                                        @change="change($event, b.on.payload)"
                                    />
                                    <text-input
                                        class="buff-title"
                                        :value="b.title.value"
                                        @change="change($event, b.title.payload)"
                                    />
                                    <span class="link" @click="store.commit('delBuff', i)">删除</span>
                                </div>
                                <div class="param-row" v-for="p in b.params">
                                    <span>{{ p.name }}</span>
                                    <param-input
                                        :type="p.param.type"
                                        :value="p.param.value"
                                        :items="p.param.items"
                                        @change="change($event, p.payload)"
                                    />
                                </div>
                            </div>
                            <div class="add-buff">
                                <param-input
                                    type="enum"
                                    :value="bid"
                                    :items="store.getters.buffTypes"
                                    @change="bid = $event as string"
                                />
                                <div class="button" @click="store.commit('addBuff', bid)">添加</div>
                            </div>
                        </div>
                        <div v-else>?</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <input-dialog title="导入预设" v-model="showImportDialog" @input="importPreset" />
    <copy-dialog title="导出预设" v-model="showExportDialog" :value="presetUrl" />
</template>

<style scoped>
.root {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: stretch;
    justify-content: center;
    color: #444;
    user-select: none;
}
.calc-header {
    padding: 20px 0;
    display: flex;
}
.calc-header img {
    display: none;
}
.imp-exp-containter {
    display: flex;
    align-items: center;
    margin-left: 10px;
}
.calc-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 800px;
    max-width: 100%;
}
.preset-title {
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    align-items: center;
}
.calc {
    flex: 1;
    background: white;
    box-shadow: 0 0 4px 0 #0007;
    border-radius: 16px 16px 0 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
}
.result {
    height: 80px;
    padding: 20px;
    text-align: right;
    line-height: 60px;
    font-size: 36px;
    font-weight: bold;
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
.panel {
    flex: 1;
    background: #f0f0f0;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    padding: 10px 20px;
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
    flex: 1;
    padding: 5px;
    overflow: auto;
}
.subtitle {
    font-weight: bolder;
    margin-top: 20px;
    margin-bottom: 10px;
    color: gray;
}
.comment {
    font-size: 12px;
    color: gray;
}
.comment::before {
    content: "· ";
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
.add-buff {
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    border: 1px dashed lightgray;
    margin-top: 10px;
}
.add-buff > .enum-input {
    width: 230px;
    margin-right: 10px;
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
}
.button:hover {
    filter: brightness(1.2);
}
.buff {
    margin-top: 10px;
    padding: 10px;
    transition: background-color 200ms ease;
}
.buff:hover {
    background-color: #e5e5e5;
}
.buff-header {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
}
.buff-title {
    flex: 1;
    margin: 0 10px;
}
.link {
    color: #0076a8;
    font-size: 14px;
    cursor: pointer;
}
.link:hover {
    text-decoration: underline;
}
@media screen and (max-width: 800px) {
    .calc-header {
        background: white;
        padding: 5px 10px;
    }
    .calc-header .link {
        display: none;
    }
    .calc-header img {
        display: inline;
    }
    .calc {
        box-shadow: none;
        border-radius: unset;
    }
    .result {
        padding: 5px 20px;
        height: unset;
        line-height: unset;
    }
}
</style>