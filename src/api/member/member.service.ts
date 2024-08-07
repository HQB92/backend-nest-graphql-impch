import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from '../../models/member.model';
import { Op } from 'sequelize';
import { CustomGraphQLError } from '../../common/errors/custom-error';
import { LoggerService } from '../../common/loggers/logger.service';
import { ResponseArray, ResponseData } from '../../types/response.type';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member)
    private memberModel: typeof Member,
    private readonly logger: LoggerService,
  ) {}

  async getAllMembers(args: any): Promise<ResponseArray> {
    this.logger.log('Member - getAll - Service - Start:');

    let filterChurch = {};
    let filterType = {};

    if (args.churchId && args.churchId !== 0) {
      filterChurch = { churchId: args.churchId };
    }

    if (args.typeMember && args.typeMember !== 0) {
      if (args.typeMember === 1) {
        filterType = {
          probationStartDate: '2024-06-23 00:00:00+00',
          fullMembershipDate: null,
        };
      }
      if (args.typeMember === 2) {
        filterType = {
          probationStartDate: { [Op.ne]: null },
          fullMembershipDate: { [Op.ne]: null },
        };
      }
      if (args.typeMember === 3) {
        filterType = {
          dateOfBirth: {
            [Op.gte]: new Date(
              new Date().setFullYear(new Date().getFullYear() - 13),
            ),
          },
        };
      }
    }

    try {
      const members = await this.memberModel.findAll({
        where: { ...filterChurch, ...filterType },
        order: [['names', 'ASC']],
      });
      console.log(members);
      return {
        code: 200,
        message: 'Members retrieved successfully',
        data: members,
      };
    } catch (error) {
      console.log(error);
      this.logger.error('Member - getAll - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async getMemberByRut(rut: string) {
    this.logger.log('Member - getByRut - Service - Start:');
    try {
      const member = await this.memberModel.findOne({ where: { rut } });
      return {
        code: 200,
        message: member ? 'Member retrieved successfully' : 'Member not found',
        data: member,
      };
    } catch (error) {
      this.logger.error('Member - getByRut - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async countMembers(): Promise<ResponseData> {
    this.logger.log('Member - count - Service - Start:');
    try {
      const count = await this.memberModel.count();
      console.log(count);
      return {
        code: 200,
        message: count ? 'Members count retrieved successfully' : 'No members',
        data: { count } as any,
      };
    } catch (error) {
      this.logger.error('Member - count - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async createMember(memberData: any) {
    this.logger.log('Member - create - Service - Start:');
    const { rut } = memberData;
    const existingMember = await this.memberModel.findOne({ where: { rut } });
    if (existingMember) {
      this.logger.error('Member - create - Service - Member already exists');
      throw new CustomGraphQLError('Member already exists', 400);
    }
    try {
      await this.memberModel.create(memberData);
      return {
        code: 200,
        message: 'Member created successfully',
      };
    } catch (error) {
      this.logger.error('Member - create - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async updateMember(memberData: any) {
    this.logger.log('Member - update - Service - Start:');
    const { rut } = memberData;
    const existingMember = await this.memberModel.findOne({ where: { rut } });
    if (!existingMember) {
      this.logger.error('Member - update - Service - Member not found');
      throw new CustomGraphQLError('Member not found', 404);
    }
    try {
      await this.memberModel.update(memberData, { where: { rut } });
      return {
        code: 200,
        message: 'Member updated successfully',
      };
    } catch (error) {
      this.logger.error('Member - update - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async deleteMember(rut: string) {
    this.logger.log('Member - delete - Service - Start:');
    const existingMember = await this.memberModel.findOne({ where: { rut } });
    if (!existingMember) {
      this.logger.error('Member - delete - Service - Member not found');
      throw new CustomGraphQLError('Member not found', 404);
    }
    try {
      await this.memberModel.destroy({ where: { rut } });
      return {
        code: 200,
        message: 'Member deleted successfully',
      };
    } catch (error) {
      this.logger.error('Member - delete - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }
}
