import { ENV } from "../../Config/app";
import { existsSync, readdirSync, statSync } from "fs";
import { join, extname, resolve } from "path";

export class ClassAutoLoader {

  static loadClasses(dir: any, className: string): string[] {

    const classes: any[] = [];
    const directory = resolve(__dirname, dir);

    if (!existsSync(directory)) {
      throw new Error(`Directory not found: ${directory}`);
  }

    function findClassses(dir: string) {

      const files = readdirSync(dir);

      for (const file of files) {

        const fullPath = join(dir, file);

        if (statSync(fullPath).isDirectory()) {

          findClassses(fullPath);

        } else if (className.toLocaleLowerCase() ==='controller' && file.toLowerCase().endsWith('controller.ts') || file.toLowerCase().endsWith('controller.js')) {

          if ((ENV.toLocaleLowerCase() === "production" && extname(file) === ".js") || extname(file) === ".ts") {
            const _class = require(fullPath);
            classes.push(_class.default || _class[Object.keys(_class)[0]]);
          }

        } else if (className.toLocaleLowerCase() ==='middleware' && file.toLowerCase().endsWith("middleware.ts") || file.toLowerCase().endsWith("middleware.js")) {

          if ((ENV.toLocaleLowerCase() === "production" && extname(file) === ".js") || extname(file) === ".ts") {
            const _class = require(fullPath);
            classes.push(_class.default || _class[Object.keys(_class)[0]]);
          }

        }
      }
    }

    findClassses(directory);

    return classes;

  }

}
