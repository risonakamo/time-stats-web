import type {Meta,StoryObj} from "@storybook/react";

import {FileList} from "components/file-list/file-list";

type Story=StoryObj<typeof FileList>;

const meta:Meta<typeof FileList>={
  title:"file list",
  component:FileList,
  args:{

  }
};
export default meta;

export const normal:Story={

};