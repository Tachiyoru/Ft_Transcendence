import { Controller, Get, Param, Post, Req, Request, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'

@Controller()
export class AppController
{
	constructor(private readonly appService: AppService) {}

	@Get('hello')
	async getUserData(@Request() req:any){
		const user = req.user;
		console.log("print user", user);
	}
	getHello(@Req() req: any): string {
	return this.appService.getHello();
	}

	@Post()
	@UseInterceptors(FilesInterceptor('image'))
	uploadFile(@UploadedFiles() file: Express.Multer.File) {
		console.log(file);
	}

}