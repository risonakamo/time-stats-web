import type {Meta,StoryObj} from "@storybook/react";

import {FileList} from "components/file-list/file-list";

type Story=StoryObj<typeof FileList>;

const meta:Meta<typeof FileList>={
  title:"file list",
  component:FileList,
  args:{
    files:[
      {
        displayName:"rouge",
        filename:"rouge.tsv",
        sheetUrl:""
      },
      {
        displayName:"lynette",
        filename:"lynette.tsv",
        sheetUrl:""
      },
      {
        displayName:"herta",
        filename:"herta.tsv",
        sheetUrl:""
      },
    ],
    selectedFile:"rouge.tsv"
  }
};
export default meta;

export const normal:Story={

};