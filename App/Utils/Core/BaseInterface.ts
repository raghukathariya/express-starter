export interface BaseInterface<T> {

  findAll(filter?:Array<T>,sort?:Array<T>,limit?:number): Promise<T[]>;

  find(id: string,selectOptions?:any): Promise<T | null>;

  findBy(key: string,value:any): Promise<T | null>;

  save(item: T): Promise<T>;

  update(id:string,item: T): Promise<T>;

  delete(id: string): Promise<T>;
  
}
