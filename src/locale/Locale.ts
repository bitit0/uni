export default interface Locale {
    base: {
        [key: string]: string
    }
    stat: {
        [key: string]: string
    }
    param: {
        [key: string]: string
    }
    formula: {
        [key: string]: {
            name: string
            params: string[]
        }
    }
    buff: {
        [key: string]: {
            name: string
            params: string[]
        }
    },
    artifact: {
        [type: string]: string
    },
    learn: {
        [type: string]: string
    }
}