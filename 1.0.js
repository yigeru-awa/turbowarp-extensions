(function(Scratch) {
    'use strict';
    const { ArgumentType, BlockType, Cast } = Scratch;

    const sep = (gap) => ({
        blockType: BlockType.XML,
        xml: `<sep gap="${gap}"></sep>`
    });
    const label = (text) => ({
        blockType: BlockType.LABEL,
        text: String(text)
    });

    class JSExtension {
        constructor() {
            this.error = "";
        }

        getInfo() {
            return {
                id: "YigeruJSExtension",
                name: "JS",
                color1: "#FFAB19",
                color2: "#CF8B17",
                color3: "#A67512",
                blocks: [
                    {
                        opcode: "evalCode",
                        blockType: BlockType.COMMAND,
                        text: "运行 [CODE]",
                        arguments: {
                            CODE: {
                                type: ArgumentType.STRING,
                                default: ""
                            }
                        }
                    },
                    {
                        opcode: "evalAndReport",
                        blockType: BlockType.REPORTER,
                        text: "运行 [CODE]",
                        arguments: {
                            CODE: {
                                type: ArgumentType.STRING,
                                default: ""
                            }
                        }
                    },
                    {
                        opcode: "getError",
                        blockType: BlockType.REPORTER,
                        text: "错误"
                    },
                    '---',
                    label("类型"),
                    {
                        opcode: "convertType",
                        blockType: BlockType.REPORTER,
                        text: "将 [INPUT] 转换为 [TYPE]",
                        arguments: {
                            INPUT: {
                                type: ArgumentType.STRING,
                                default: ""
                            },
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: "types"
                            }
                        }
                    },
                    {
                        opcode: "checkType",
                        blockType: BlockType.REPORTER,
                        text: "[INPUT] 的类型",
                        arguments: {
                            INPUT: {
                                type: ArgumentType.STRING,
                                default: ""
                            }
                        }
                    },
                    '---',
                    label("本地存储"),
                    {
                        opcode: "clearStorage",
                        blockType: BlockType.COMMAND,
                        text: "清空本地存储"
                    },
                    {
                        opcode: "setKey",
                        blockType: BlockType.COMMAND,
                        text: "设置 [KEY] 的值为 [VALUE]",
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "setKeyWithExpiry",
                        blockType: BlockType.COMMAND,
                        text: "设置 [KEY] 的值为 [VALUE] [TIME] 秒后过期",
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            },
                            TIME: {
                                type: ArgumentType.STRING,
                                defaultValue: "100"
                            }
                        }
                    },
                    {
                        opcode: "getKey",
                        blockType: BlockType.REPORTER,
                        text: "[KEY] 的值",
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "removeKey",
                        blockType: BlockType.COMMAND,
                        text: "移除 [KEY]",
                        arguments: {
                            KEY: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    '---',
                    label("控制台"),
                    {
                        opcode: "consoleLog",
                        blockType: BlockType.COMMAND,
                        text: "[LOG] 报告 [TEXT]",
                        arguments: {
                            LOG: {
                                type: ArgumentType.IMAGE,
                                dataURI: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFCUlEQVR4nO2YSUwbVxjHh1Ztis0SttisxmYxOxjUVL300kMvPfVS9dBL21SqVKlS1ahVKwW1YicYs+9hM5iYQIMDDmCsSlVTtRV7IDDeVzCZYcapoqAoKl81PtpRB88brB74S3Md/X5v3vfm+x6GXeQiF+Elb/5yJK5YPv6ofIm6WbZILZTpj1dLF0hL8QJpLZ4nV4t1xP0iHdFaqCM+zrtHpmP/h1TpvILyZfqawkD/VrF0fFq+REH5IgVl94+hVH8MJQsklMyTUHyPgCIdAYVzBBTefQwFPz8G+ezRXwV3jr6U3yViIw5epIXXK430dcUKdaQw0FCxTEGY8CCfOYL8O0eQN+2jcrW+GxlaV3RE4BWGJ28rVug9xQoNPMBDrtYHubcPQaY5sMk0vnfPFb7SSH+jWKFf8A2fM8UIHIJs0vuPVO39EQOI4pccIKrS6G+pNPrh/OAPQDpxANlqL0jGPeqqvtXXeOOvMvpVkYP3gmTMC1kjbg1WDa/wAf9dxOFHPZA54oGMYVcDErzCSL3Ddc/LtW7IU5shb9wMeRoXB3g3ZAy5TtOGPO9zgs/Vw6VKI41zgS/S2ED9iADq5EXgGd8hIH/cEh78LTekD7khbdDlkwzbL4ctULniv8Fp5ac9UPPHAQTnpwdekKld4cJD2oALUvsdyrDgr+rJOIWBorns+fwpJ0w+IkMEJnYIkI7aOcA7QdTrPEnqcKadWUBhoL/mWrD5Wi9cW3aECHyit4N03BU2vLgvIACibkfNmQUqluktlNMmR22Dz5cccBcnA8+nDPywhTt8jwNSuhzOMx2rZYYn+bwclRoPyEZtIB2xgUztRoK/0s0I2CGx0/YW++obqC9Q4XPGrJA9sAuS/l2Q9O1AVu8OSIbMSPDJnXZIbrd+z/4FFo+HUX9SDHxwMrsfosF32CCxzTp3BgHqd9Q/LLPqIQJd20jwSe02SFBZ99gF9KQTtT2Q9D4MEcjo3EKCT2xjBCxPWQVK9SSF2ttk9YQKpHdsIcEnqqyQoLScYlp49T8FiucJP2pjltm9HSKQ1rGJBt9qhctKC2BsbXbJPOlF7SpfKtC+iQwf32I+Yd1CxTpiA7UlZgo2OKltm4jwFohrNjtZBYrmiCnUfp4p2OCIVRtI8PHNFohtNC+xChTMEd+iDiNMwYYItG4gwcc1mRmBRvYvMEteRZ2kmIINjki5jgoPggbze6wCzDEln/V5uI+B7kDBBudKyzoSvLAB92PV9jfYBTAMk8/4GrnCM0clU7DBSbm5zhk+psEEwnp8EDtrZFpvVu607zkXeOaoZAo2RKB5jTN8TB1+KqzdL8PCSc5t3y2OM2ygYIOT3LTGDb7eBMJa0ywWbqSTPlGO5pDmMsOKlKECSU3rHOHxZ5fqcVnYAgGJCd9nnGbYjr3Anme2DbPySY1rkKTcDR++zgSCGvw6hpJs9cEk6iTFaeXrTBBds7+AfE/KXHtLxjy/Rhy+Ft+Or+ZwH/SyMBdLmSPuBxFc+U1B044Y4zOpfV5BxrBrJgLwSwkN1njsXAIQlT7o/ip1wPnsHOCfC2rwH3i5kWaLqN8hFfc5Z8W9jlN+4PHFmNr9AizSSemxlYt67GMp3fan4cPjJzH1pqnoOpz9rufcRTp3YhK77B8kt9s6k9psfyaqbP7QYcTyd2yjaTW2wdQnrNv/8Pz2OU8RNR8KhSqrSKB0pDKCfL33IhfB+M2/hW3M5uDgqEwAAAAASUVORK5CYII="
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "consoleWarn",
                        blockType: BlockType.COMMAND,
                        text: "[WARN] 警告 [TEXT]",
                        arguments: {
                            WARN: {
                                type: ArgumentType.IMAGE,
                                dataURI: "data:image/png;base64,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"
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "consoleError",
                        blockType: BlockType.COMMAND,
                        text: "[ERROR] 报错 [TEXT]",
                        arguments: {
                            ERROR: {
                                type: ArgumentType.IMAGE,
                                dataURI: "data:image/png;base64,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"
                            },
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    '---',
                    label("窗口"),
                    {
                        opcode: "showAlert",
                        blockType: BlockType.COMMAND,
                        text: "警告 [TEXT]",
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "showConfirm",
                        blockType: BlockType.BOOLEAN,
                        text: "询问是/否 [TEXT]",
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "showPrompt",
                        blockType: BlockType.REPORTER,
                        text: "询问 [TEXT] 默认文本: [DEFAULT_TEXT]",
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            },
                            DEFAULT_TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                ],
                menus: {
                    types: {
                        items: [
                            {
                                text: "字符串",
                                value: "string"
                            },
                            {
                                text: "数字",
                                value: "number"
                            },
                            {
                                text: "布尔值",
                                value: "boolean"
                            }
                        ]
                    }
                }
            }
        }

        evalCode({ CODE }) {
            try {eval(CODE);} catch (error) {this.error = error;}
        }

        evalAndReport({ CODE }) {
            try {return eval(CODE);} catch (error) {this.error = error;}
        }

        getError() {
            return this.error;
        }

        convertType({ INPUT, TYPE }) {
            switch(TYPE) {
                case 'string':
                    return Cast.toString(INPUT);
                case 'number':
                    return Cast.toNumber(INPUT);
                case 'boolean':
                    return Cast.toBoolean(INPUT);
            }
        }

        checkType({ INPUT }) {
            return typeof INPUT;
        }

        clearStorage() {
            localStorage.clear();
        }

        setKey({ KEY, VALUE }) {
            if (typeof VALUE === 'object') {
                VALUE = JSON.stringify(VALUE);
            }
            localStorage.setItem(KEY, VALUE);
        }

        setKeyWithExpiry({ KEY, VALUE, TIME }) {
            const expiryMs = TIME * 1000;
            const item = {
                value: VALUE,
                expiry: Date.now() + expiryMs,
            };
            this.setKey(KEY, item);
        }

        getKey({ KEY }) {
            const value = localStorage.getItem(KEY);
            try {
                return JSON.parse(value);
            } catch (error) {
                this.error = error;
                return value;
            }
        }

        removeKey({ KEY }) {
            localStorage.removeItem(KEY);
        }

        consoleLog({ TEXT }) {
            console.log(TEXT);
        }

        consoleWarn({ TEXT }) {
            console.warn(TEXT);
        }

        consoleError({ TEXT }) {
            console.error(TEXT);
        }

        showAlert({ TEXT }) {
            alert(TEXT);
        }

        showConfirm({ TEXT }) {
            return confirm(TEXT);
        }

        showPrompt({  TEXT, DEFAULT_TEXT }) {
            return prompt(TEXT, DEFAULT_TEXT);
        }
    }

    Scratch.extensions.register(new JSExtension());
})(Scratch);