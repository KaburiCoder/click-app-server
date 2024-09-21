import { EnvService } from "@/config/env/env.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";

@Injectable()
export class HsMongooseConfig implements MongooseOptionsFactory {
  constructor(private readonly env: EnvService) {}
  
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.env.MONGODB_HS_URL,
    };
  }
}