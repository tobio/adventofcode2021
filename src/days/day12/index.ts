import { Day } from "..";
import * as og from "./og";
import * as oo from "./oo";

const day: Day = {
  id: 12,
  exec: (input: string) => {
    og.findPathLengths(input);
    oo.findPathLengths(input);
  },
  sampleInput: `start-A
start-b
A-c
A-b
b-d
A-end
b-end`
  };

  export default day;
