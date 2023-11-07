import { Controller, Get, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'

@Controller()
export class AppController
{
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
	return this.appService.getHello();
	}

	@Post()
	@UseInterceptors(FilesInterceptor('image'))
	uploadFile(@UploadedFiles() file: Express.Multer.File) {
		console.log(file);
	}

}