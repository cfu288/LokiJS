import Sylvie from "../modules/sylvie";
/** there are two build in persistence adapters for internal use
 * fs             for use in Nodejs type environments
 * localStorage   for use in browser environment
 * defined as helper classes here so its easy and clean to use
 */
export interface PersistenceAdapter {
    mode: string | undefined;
    loadDatabase(dbname: string, callback: (value: any) => void): void;
    deleteDatabase(dbnameOrOptions: any, callback: (err?: Error | null, data?: any) => void): void;
    exportDatabase?(dbname: string, dbref: typeof Sylvie, callback: (err: Error | null) => void): void;
    saveDatabase(dbname: string, dbstring: any, callback: (err?: Error | null) => void): void;
}
