import { PartialType } from '@nestjs/mapped-types';
import { CreateEpisodeDto } from './create_episode.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateEpisodeDto extends PartialType(CreateEpisodeDto) {}
