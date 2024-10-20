import { Upload } from "../Models/Upload";
import { HttpException } from "../../../Utils/Common/HttpException";
import { UploadInterface } from "../Repositories/UploadInterface";
import { HttpStatus } from "../../../Utils/Common/HttpStatus";
import { Inject, Service } from "typedi";

@Service()
export class UploadService {
  constructor(
    @Inject('UploadInterface') private uploadRepo: UploadInterface
  ) { }

  async findById(id: string): Promise<Upload> {
    try {
      const upload: Upload = await this.uploadRepo.find(id);
      return upload ? upload : null;
    } catch (error) {
      throw new HttpException(
        HttpStatus.SERVER_ERROR,
        "Failed to find upload data"
      );
    }
  }

  async findAll(): Promise<Upload[] | []> {
    try {
      const uploads: Upload[] = await this.uploadRepo.findAll();
      return uploads ? uploads : [];
    } catch (error) {
      throw new HttpException(
        HttpStatus.SERVER_ERROR,
        "Unable to retrieve data"
      );
    }
  }

  async save(payload: Upload): Promise<Upload> {
    try {
      const data = await this.uploadRepo.save(payload);
      return data ?? null;
    } catch (error) {
      throw new HttpException(
        HttpStatus.SERVER_ERROR,
        "Failed to save data" + error
      );
    }
  }

  async update(id: string, payload: any): Promise<any> {
    try {
      const data = await this.uploadRepo.update(id, payload);
      return data ?? null;
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to update data");
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const data = await this.uploadRepo.delete(id);
      return data ?? null;
    } catch (error) {
      throw new HttpException(HttpStatus.SERVER_ERROR, "Failed to delete data");
    }
  }
}

// src/modules/uploads/services/UploadService.ts
