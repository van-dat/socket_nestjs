import { ApiProperty } from '@nestjs/swagger';

export class Blog {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  summary: string;

  @ApiProperty({ nullable: true })
  image?: string;

  @ApiProperty()
  author: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
