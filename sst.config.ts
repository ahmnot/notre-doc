import { SSTConfig } from "sst";
import { Api } from "./stacks/Api";
import { Web } from "./stacks/Web";
import { Database } from "./stacks/Database";
import { Auth } from "./stacks/Auth";

export default {
  config(_input) {
    return {
      name: "notre-doc",
      region: "eu-west-3",
    };
  },
  stacks(app) {
    app
      .stack(Database)
      .stack(Api)
      .stack(Web)
      .stack(Auth);
  }
} satisfies SSTConfig;
