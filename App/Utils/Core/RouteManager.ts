import express from 'express';
import Table from 'cli-table3';
import { blue, green, yellow, red } from 'colorette'; // Import colorette

interface Route {
    method: string;
    path: string;
}

export class RouteManager {
    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
    }

    private getRoutes(): Route[] {
        return this.app._router.stack
            .filter((layer: any) => layer.route)
            .map((layer: any) => ({
                method: Object.keys(layer.route.methods)[0].toUpperCase(),
                path: (layer.route.path as string)
            }))
            .sort((a: Route, b: Route) => a.path.localeCompare(b.path)); // Sort routes by path in ascending order
    }

    public displayRoutes(): void {
        const routes = this.getRoutes();

        // Create a table
        const table = new Table({
            head: ['HTTP Method', 'Path']
        });

        // Populate the table
        routes.forEach(route => {
            // Colorize route method
            const coloredMethod = this.colorizeMethod(route.method);
            table.push([coloredMethod, route.path]);
        });

        // Display the table
        console.log(table.toString());
    }

    private colorizeMethod(method: string): string {
        switch (method) {
            case 'GET':
                return green(method); // Use colorette for coloring
            case 'POST':
                return blue(method);
            case 'PUT':
                return yellow(method);
            case 'DELETE':
                return red(method);
            default:
                return method;
        }
    }
}
