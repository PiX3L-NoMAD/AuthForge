// This file will talk to DynamoDB using @aws-sdk/lib-dynamodb

import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    private table = process.env.DYNAMODB_TABLE_USERS || 'AuthForgeUsers';
    private docClient: DynamoDBDocumentClient;

    constructor() {
        const client = new DynamoDBClient({
            region: process.env.AWS_REGION,,
            endpoint: process.env.DYNAMODB_ENDPOINT || undefined, // use for local DynamoDB, optional
        });
        this.docClient = DynamoDBDocumentClient.from(client);
    }

    async createUser(username: string, email: string, passwordHash: string) {
        const id = uuidv4();
        const item = {
            pk: `user#${id}`,
            id,
            username,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
            // refreshTokenHash: null, // add this field when implementing refresh tokens
        };
        await this.docClient.send(new PutCommand({ TableName: this.table, Item: item }));
        return { id, username, email, createdAt: item.createdAt  };
    }

    async findByEmail(email: string) {
        // keep table simple: create a GSI on email or query by scanning for MVP
        // Quick MVP: use a Query on a GSI named email-index'
        const res = await this.docClient.send(new QueryCommand({
            TableName: this.table,
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :e',
            ExpressionAttributeValues: { ':e': email },
        }));
        return res.Items?.[0] ?? null;
    }

    async findById(id: string) {
        const res = await this.docClient.send(new GetCommand({
            TableName: this.table,
            Key: { pk: `user#${id}` },
        }));
        return res.Item ?? null;
    }

    async setRefreshTokenHash(id: string, refreshTokenHash: string) {
        await this.docClient.send(new PutCommand({
            TableName: this.table,
            Item: {
                pk: `user#${id}`,
                id,
                refreshTokenHash,
                updatedAt: new Date().toISOString(),
            },
        }))
    }

    // For MVP, if you prefer to update only one attribute use UpdateCommand. This is simplified.
}