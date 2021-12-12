import Locale from "./Locale"

export default <Locale>{
    "base": {
        "key": "类型",
        "multiplier": "倍率",
        "addend": "加性常数"
    },
    "stat": {
        "lv": "等级",
        "hp": "生命值",
        "baseHP": "基础生命值",
        "hpp": "生命值%",
        "atk": "攻击力",
        "baseATK": "基础攻击力",
        "atkp": "攻击力%",
        "def": "防御力",
        "baseDEF": "基础防御力",
        "defp": "防御力%",
        "em": "元素精通",
        "stamina": "体力",
        "cr": "暴击率",
        "cd": "暴击伤害",
        "hb": "治疗加成",
        "ihb": "受治疗加成",
        "er": "元素充能效率",
        "cdr": "冷却缩减",
        "ss": "护盾强效",
        "pyroDB": "火元素伤害加成",
        "pyroRES": "火元素抗性",
        "hydroDB": "水元素伤害加成",
        "hydroRES": "水元素抗性",
        "dendroDB": "草元素伤害加成",
        "dendroRES": "草元素抗性",
        "electroDB": "雷元素伤害加成",
        "electroRES": "雷元素抗性",
        "anemoDB": "风元素伤害加成",
        "anemoRES": "风元素抗性",
        "cryoDB": "冰元素伤害加成",
        "cryoRES": "冰元素抗性",
        "geoDB": "岩元素伤害加成",
        "geoRES": "岩元素抗性",
        "physicalDB": "物理伤害加成",
        "physicalRES": "物理抗性",
        "db": "伤害加成",
        "res": "抗性",
        "rr": "减抗",
        "bb": "基础乘区",
        "rb": "反应加成系数"
    },
    "param": {
        "pyro": "火",
        "hydro": "水",
        "dendro": "草",
        "electro": "雷",
        "anemo": "风",
        "cryo": "冰",
        "geo": "岩",
        "physical": "物理",
        "min": "不暴击",
        "avg": "期望",
        "max": "暴击",
        "pyro_melt": "火融化",
        "pyro_vapo": "火蒸发",
        "hydro_vapo": "水蒸发",
        "cryo_melt": "冰融化"
    },
    "formula": {
        "sim_dmg": {
            "name": "普通伤害",
            "params": ["元素类型", "是否暴击"]
        },
        "amp_dmg": {
            "name": "增幅伤害",
            "params": ["反应类型", "是否暴击"]
        },
        "trf_dmg": {
            "name": "剧变伤害",
            "params": []
        },
        "shield": {
            "name": "护盾吸收量",
            "params": []
        },
        "heal": {
            "name": "治疗量",
            "params": []
        },
    },
    "buff": {
        "add": {
            "name": "提升A",
            "params": ["提升", "提升量"]
        },
        "add_%": {
            "name": "提升A (%)",
            "params": ["提升", "提升量"]
        },
        "add_base": {
            "name": "提升攻生防 (%)",
            "params": ["提升", "提升比例"]
        },
        "add_by": {
            "name": "基于A，提升B",
            "params": ["提升", "基于", "基于比例"]
        },
        "add_by_%": {
            "name": "基于A，提升B (%)",
            "params": ["提升", "基于", "基于比例"]
        },
        "add_by_up": {
            "name": "基于A，提升B，上限为C",
            "params": ["提升", "基于", "基于比例", "上限"]
        },
        "add_by_up_%": {
            "name": "基于A，提升B，上限为C (%)",
            "params": ["提升", "基于", "基于比例", "上限"]
        }
    },
    artifact: {
        "flower": '生之花',
        "plume": '死之羽',
        "sands": '时之沙',
        "goblet": '空之杯',
        "circlet": '理之冠'
    },
    learn: {
        "trainSize": "训练集大小",
        "resin": "投入体力",
        "niter": "迭代次数"
    }
}