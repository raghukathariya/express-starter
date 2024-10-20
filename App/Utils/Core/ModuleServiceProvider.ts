import * as path from 'path';
import * as fs from 'fs/promises';
import { greenBright, yellowBright } from "colorette"
import { Container, Token } from "typedi";

export class ModuleServiceProvider {
    private cache: Set<string> = new Set();

    constructor(private baseDir: string) { }

    public async bindRepositoriesRecursively() {
        await this.readDirAndAutoBind(this.baseDir);
    }

    private async readDirAndAutoBind(dir: string) {
        try {
            const files = await fs.readdir(dir);

            for (const file of files) {
                const fullPath = path.join(dir, file);

                if (this.cache.has(fullPath)) continue; 

                const stat = await fs.stat(fullPath);

                if (stat.isDirectory()) {
                    await this.readDirAndAutoBind(fullPath);
                } else if (file.endsWith('Repository.ts') || file.endsWith('Repository.js')) {
                    this.cache.add(fullPath);

                    try {
                        const module: any = await import(fullPath);

                        Object.keys(module).forEach((exportedClass) => {
                            const repository = module[exportedClass] || module.default;

                            if (typeof repository === 'function' && repository.prototype) {
                                const tokenName = exportedClass.replace(/Repository$/, 'Interface');
                                const token = new Token(tokenName);
                                console.log(`Binding ${yellowBright(exportedClass)} to token >>>==> ${greenBright(token.name)}`);

                                if (!Container.has(token.name)) {
                                    Container.set(token.name, new repository());
                                }
                            } else {
                                console.error(`Error: ${exportedClass} is not a constructor`);
                            }
                        });
                    } catch (err) {
                        console.error(`Error importing module at ${fullPath}:`, err);
                    }
                }
            }
        } catch (err) {
            console.error(`Error reading directory ${dir}:`, err);
        }
    }
}
