export type AttachmentMetaData = Record;

type Record = {
  id: string;
  fields: {
    [fieldCode: string]: Field;
  };
};

type Field = FileField | SubTableField;

export type FileField = {
  type: "FILE";
  value: FileInfo[];
};

export type SubTableField = {
  type: "SUBTABLE";
  value: SubTableRow[];
};

export type SubTableRow = {
  id: string;
  fields: { [fieldCode: string]: FileField };
};

type FileInfo = {
  name: string;
  filePath: string;
  fileKey: string;
};
