import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // async create(createUserDto: CreateUserDto) {
  //   const existingUser = await this.prisma.user.findUnique({
  //     where: { email: createUserDto.email },
  //   });

  //   if (existingUser) {
  //     throw new ConflictException('Email already exists');
  //   }

  //   const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  //   const user = await this.prisma.user.create({
  //     data: {
  //       ...createUserDto,
  //       password: hashedPassword,
  //     },
  //   });

  //   return this.excludePassword(user);
  // }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.excludePassword(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check if user exists

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.excludePassword(user);
  }

  async remove(id: string) {
    await this.findOne(id); // Check if user exists

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} deleted successfully` };
  }

  private excludePassword(user: any) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

