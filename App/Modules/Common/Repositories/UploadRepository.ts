import { BaseRepository } from "../../../Utils/Core/BaseRepository";
import UploadSchema, { UploadDocument } from "../Schemas/UploadSchema";
import { UploadInterface } from "./UploadInterface";
import { Service } from "typedi";

@Service()
export class UploadRepository
  extends BaseRepository<UploadDocument>
  implements UploadInterface
{
  constructor() {
    super(UploadSchema);
  }
}

// App/Modules/User/Repositories/Userrepository.ts
