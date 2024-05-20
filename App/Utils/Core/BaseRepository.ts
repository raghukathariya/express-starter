import { Service } from "typedi";
import { BaseInterface } from "./BaseInterface";
import { HttpStatus } from "../Common/HttpStatus";
import { HttpException } from "../Common/HttpException";
import { Model, Document, startSession } from "mongoose";
@Service()
export abstract class BaseRepository<T extends Document> implements BaseInterface<T> {
  protected model: any;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findAll(filter?: any, sort?: any, limit?: number): Promise<T[]> {
    try {
      const data = await this.model.find({}).exec();
      return data ? data : [];
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Unable to retrieve data");
    }
  }

  async find(id: string, selectOptions?: any): Promise<T | null> {
    try {
      const data = await this.model.findOne({ _id: id }, selectOptions);
      return data ?? null;
    } catch (error) {
      throw new HttpException(
        HttpStatus.SERVER_ERROR,
        "Unable to retrieve data"
      );
    }
  }

  async findBy(key: string, value: any): Promise<T | null> {
    try {
      const match = `{${key}:${value}}`;
      console.log("Match", match);
      const data = await this.model.findOne(match);
      return data ?? null;
    } catch (error) {
      throw new HttpException(
        HttpStatus.SERVER_ERROR,
        "Unable to retrieve data"
      );
    }
  }

  async save(payload: any): Promise<T | null> {
    const session = await startSession();
    session.startTransaction();

    try {
      const data = await this.model.create(payload);
      await session.commitTransaction();
      return data;
    } catch (error) {
      await session.abortTransaction();
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to save data");
    } finally {
      session.endSession();
    }
  }

  async update(id: string, payload: any): Promise<T | null> {
    const session = await startSession();
    session.startTransaction();

    try {
      const result = await this.model.updateOne(
        { _id: id },
        { $set: payload },
        { upsert: true }
      );

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to update data");
    } finally {
      session.endSession();
    }
  }

  async delete(id: string): Promise<T> {
    const session = await startSession();
    session.startTransaction();

    try {
      const result = await this.model.findOneAndDelete({ _id: id });
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to delete data");
    } finally {
      session.endSession();
    }
  }
}
