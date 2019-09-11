import {
    StringField,
    StringListField,
    EntityListField,
    SubTableField,
    FileField,
    FieldGroup,
    CalculatedField,
} from "./fields";

describe("StringField", () => {
    test("toTsExpression()", () => {
        expect(
            new StringField("fieldName", "SINGLE_LINE")
                .tsExpression()
                .trim()
        ).toEqual(
            `
"fieldName" : {
    type: "SINGLE_LINE";
    value: string;
    disabled?: boolean;
    error?: string;
};`.trim()
        );
    });
});

describe("StringField with Full Width Symbol FieldCode", () => {
    test("toTsExpression() with ・", () => {
        expect(
            new StringField("・", "SINGLE_LINE")
                .tsExpression()
                .trim()
        ).toEqual(
            `
"・" : {
    type: "SINGLE_LINE";
    value: string;
    disabled?: boolean;
    error?: string;
};`.trim()
        );
    });
    test("toTsExpression() with ￥", () => {
        expect(
            new StringField("￥", "SINGLE_LINE")
                .tsExpression()
                .trim()
        ).toEqual(
            `
"￥" : {
    type: "SINGLE_LINE";
    value: string;
    disabled?: boolean;
    error?: string;
};`.trim()
        );
    });
    test("toTsExpression() with ＿", () => {
        expect(
            new StringField("＿", "SINGLE_LINE")
                .tsExpression()
                .trim()
        ).toEqual(
            `
"＿" : {
    type: "SINGLE_LINE";
    value: string;
    disabled?: boolean;
    error?: string;
};`.trim()
        );
    });
    test("toTsExpression() with ＄", () => {
        expect(
            new StringField("＄", "SINGLE_LINE")
                .tsExpression()
                .trim()
        ).toEqual(
            `
"＄" : {
    type: "SINGLE_LINE";
    value: string;
    disabled?: boolean;
    error?: string;
};`.trim()
        );
    });
});

describe("StringListField", () => {
    test("toTsExpression()", () => {
        expect(
            new StringListField("fieldName", "CHECK_BOX")
                .tsExpression()
                .trim()
        ).toEqual(
            `
"fieldName" : {
    type: "CHECK_BOX";
    value: string[];
    disabled?: boolean;
    error?: string;
};`.trim()
        );
    });
});

describe("EntityListField", () => {
    test("toTsExpression()", () => {
        expect(
            new EntityListField("fieldName", "USER_SELECT")
                .tsExpression()
                .trim()
        ).toEqual(
            `
"fieldName" : {
    type: "USER_SELECT";
    value: {code: string, name: string}[];
    disabled?: boolean;
    error?: string;
};`.trim()
        );
    });
});

describe("SubTableField", () => {
    test("toTsExpression()", () => {
        const fieldGroup = new FieldGroup(
            [],
            [],
            [],
            [],
            []
        );
        expect(
            new SubTableField(
                "fieldName",
                "SUBTABLE",
                fieldGroup
            )
                .tsExpression()
                .trim()
        ).toEqual(
            `
"fieldName" : {
    type: "SUBTABLE";
    value: {
        id: string;
        value: {
            
        }
    }[];
};`.trim()
        );
    });
});

describe("FileField", () => {
    test("toTsExpression()", () => {
        expect(
            new FileField("fieldName", "FILE")
                .tsExpression()
                .trim()
        ).toEqual(
            `
"fieldName" : {
    type: "FILE";
    value: {
        contentType: string;
        fileKey: string;
        name: string;
        size: string;
    }[];
    disabled?: boolean;
    error?: string;
};`.trim()
        );
    });
});

describe("FieldGroup", () => {
    test("toTsExpression()", () => {
        expect(
            new FieldGroup(
                [
                    new StringField(
                        "fieldName1",
                        "SINGLE_STRING_LINE"
                    ),
                    new StringField(
                        "fieldName2",
                        "SINGLE_STRING_LINE"
                    ),
                ],
                [new CalculatedField("fieldName3", "CALC")],
                [
                    new StringListField(
                        "fieldName4",
                        "MULTI_CHECK"
                    ),
                ],
                [
                    new EntityListField(
                        "fieldName5",
                        "USER_SELECT"
                    ),
                ],
                [new FileField("fieldName6", "FILE")]
            )
                .tsExpression()
                .trim()
        ).toEqual(
            `
"fieldName1" : {
    type: "SINGLE_STRING_LINE";
    value: string;
    disabled?: boolean;
    error?: string;
};
"fieldName2" : {
    type: "SINGLE_STRING_LINE";
    value: string;
    disabled?: boolean;
    error?: string;
};
"fieldName3" : {
    type: "CALC";
    value: string;
    error?: string;
};
"fieldName4" : {
    type: "MULTI_CHECK";
    value: string[];
    disabled?: boolean;
    error?: string;
};
"fieldName5" : {
    type: "USER_SELECT";
    value: {code: string, name: string}[];
    disabled?: boolean;
    error?: string;
};
"fieldName6" : {
    type: "FILE";
    value: {
        contentType: string;
        fileKey: string;
        name: string;
        size: string;
    }[];
    disabled?: boolean;
    error?: string;
};`.trim()
        );
    });
});
