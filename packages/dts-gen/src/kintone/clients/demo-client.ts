import {
    FetchFormPropertiesInput,
    FormsClient,
    FieldType,
    SubTableFieldType,
} from "./forms-client";
import { Promise } from "es6-promise";

export class DemoClient implements FormsClient {
    fetchFormProperties(
        input: FetchFormPropertiesInput
    ): Promise<{
        [key: string]: FieldType | SubTableFieldType;
    }> {
        return Promise.resolve(
            {
                properties: {
                    文字列__1行_: {
                        type: "SINGLE_LINE_TEXT",
                        code: "文字列__1行_",
                        label: "文字列 (1行)",
                        noLabel: false,
                        required: true,
                        unique: true,
                        maxLength: "64",
                        minLength: "0",
                        defaultValue: "",
                        expression: "",
                        hideExpression: false,
                    },
                    数値: {
                        type: "NUMBER",
                        code: "数値",
                        label: "数値",
                        noLabel: true,
                        required: false,
                        unique: false,
                        maxValue: "64",
                        minValue: "0",
                        defaultValue: "12345",
                        expression: "",
                        digit: true,
                        displayScale: "",
                        unit: "$",
                        unitPosition: "BEFORE",
                    },
                    ラジオボタン: {
                        type: "RADIO_BUTTON",
                        code: "ラジオボタン",
                        label: "ラジオボタン",
                        noLabel: false,
                        required: true,
                        defaultValue: "sample2",
                        options: {
                            sample1: {
                                label: "sample1",
                                index: 0,
                            },
                            sample2: {
                                label: "sample2",
                                index: 1,
                            },
                            sample3: {
                                label: "sample3",
                                index: 2,
                            },
                        },
                        align: "horizontal",
                    },
                    チェックボックス: {
                        type: "CHECK_BOX",
                        code: "チェックボックス",
                        label: "チェックボックス",
                        noLabel: false,
                        required: false,
                        defaultValue: [
                            "sample1",
                            "sample3",
                        ],
                        options: {
                            sample1: {
                                label: "sample1",
                                index: 0,
                            },
                            sample2: {
                                label: "sample2",
                                index: 2,
                            },
                            sample3: {
                                label: "sample3",
                                index: 1,
                            },
                        },
                        align: "horizontal",
                    },
                    日付: {
                        type: "DATE",
                        code: "日付",
                        label: "日付",
                        noLabel: false,
                        required: false,
                        unique: true,
                        defaultValue: "",
                        defaultNowValue: true,
                    },
                    日時: {
                        type: "DATETIME",
                        code: "日時",
                        label: "日時",
                        noLabel: false,
                        required: false,
                        unique: false,
                        defaultValue:
                            "2012-07-19T00:00:00.000Z",
                        defaultNowValue: false,
                    },
                    添付ファイル: {
                        type: "FILE",
                        code: "添付ファイル",
                        label: "添付ファイル",
                        noLabel: true,
                        required: false,
                        thumbnailSize: "150",
                    },
                    リンク: {
                        type: "LINK",
                        code: "リンク",
                        label: "リンク",
                        noLabel: true,
                        required: false,
                        unique: false,
                        defaultValue: "http://hoge.xxx",
                        maxLength: "64",
                        minLength: "0",
                        protocol: "WEB",
                    },
                    ユーザー選択: {
                        type: "USER_SELECT",
                        code: "ユーザー選択",
                        label: "ユーザー選択",
                        noLabel: true,
                        required: false,
                        defaultValue: [
                            {
                                code: "user1",
                                type: "USER",
                            },
                            {
                                code: "group1",
                                type: "GROUP",
                            },
                            {
                                code: "org1",
                                type: "ORGANIZATION",
                            },
                            {
                                code: "LOGINUSER()",
                                type: "FUNCTION",
                            },
                        ],
                        entities: [
                            {
                                code: "user1",
                                type: "USER",
                            },
                            {
                                code: "group1",
                                type: "GROUP",
                            },
                        ],
                    },
                    関連レコード一覧: {
                        type: "REFERENCE_TABLE",
                        code: "関連レコード一覧",
                        label: "関連レコード一覧",
                        noLabel: true,
                        referenceTable: {
                            relatedApp: {
                                app: "3",
                                code: "参照先アプリ",
                            },
                            condition: {
                                field:
                                    "このアプリのフィールド",
                                relatedField:
                                    "参照するアプリのフィールド",
                            },
                            filterCond:
                                "数値 > 10 and 数値2 > 20",
                            displayFields: [
                                "表示するフィールド1",
                                "表示するフィールド2",
                            ],
                            sort:
                                "ソートフィールド1 desc, ソートフィールド2 asc",
                            size: 5,
                        },
                    },
                    ルックアップ: {
                        type: "SINGLE_LINE_TEXT",
                        code: "ルックアップ",
                        label: "ルックアップ",
                        noLabel: true,
                        required: false,
                        lookup: {
                            relatedApp: {
                                app: "100",
                                code: "コピー元アプリ",
                            },
                            relatedKeyField:
                                "コピー元のフィールド",
                            fieldMappings: [
                                {
                                    field:
                                        "コピー先のフィールド",
                                    relatedField:
                                        "コピー元のフィールド",
                                },
                            ],
                            lookupPickerFields: [
                                "ルックアップ選択時に表示されるフィールド1",
                            ],
                            filterCond:
                                "数値 > 10 and 数値2 > 20",
                            sort:
                                "ソートフィールド1 desc, ソートフィールド2 asc",
                        },
                    },
                    グループ: {
                        type: "GROUP",
                        code: "グループ",
                        label: "グループ",
                        noLabel: true,
                        openGroup: true,
                    },
                    テーブル: {
                        type: "SUBTABLE",
                        code: "テーブル",
                        fields: {
                            文字列__1行_テーブル: {
                                type: "SINGLE_LINE_TEXT",
                                code:
                                    "文字列__1行_テーブル",
                                label:
                                    "文字列 (1行)テーブル",
                                noLabel: false,
                                required: true,
                                unique: false,
                                maxLength: "64",
                                minLength: "0",
                                defaultValue: "",
                                expression: "",
                                hideExpression: false,
                            },
                            文字列__1行_テーブル2: {
                                type: "SINGLE_LINE_TEXT",
                                code:
                                    "文字列__1行_テーブル2",
                                label:
                                    "文字列 (1行)テーブル",
                                noLabel: false,
                                required: true,
                                unique: false,
                                maxLength: "64",
                                minLength: "0",
                                defaultValue: "",
                                expression: "",
                                hideExpression: false,
                            },
                        },
                    },
                    ステータス: {
                        type: "STATUS",
                        code: "ステータス",
                        label: "ステータス",
                        enabled: "true",
                    },
                    作業者: {
                        type: "STATUS_ASSIGNEE",
                        code: "作業者",
                        label: "作業者",
                        enabled: "true",
                    },
                    カテゴリー: {
                        type: "CATEGORY",
                        code: "カテゴリー",
                        label: "カテゴリー",
                        enabled: "true",
                    },
                },
                revision: "2",
            }.properties
        );
    }
}
