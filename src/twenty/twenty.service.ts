// src/twenty/twenty.service.ts
import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';

@Injectable()
export class TwentyService {
  private readonly client: Axios;

  constructor() {
    this.client = new Axios({
      baseURL: process.env.TWENTY_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${process.env.TWENTY_API_KEY}`,
        'Workspace-Id': process.env.TWENTY_WORKSPACE_ID,
      },
    });
  }

  async createActivity(meetingData: any) {
    const response = await this.client.post('/activities', {
      type: 'MEETING',
      title: meetingData.title,
      content: meetingData.summary,
      metadata: {
        notes: meetingData.fullNotes,
        actionItems: meetingData.actionItems,
      },
    });

    return JSON.parse(response.data);
  }

  async linkToObject(activityId: string, objectId: string) {
    await this.client.post(`/activities/${activityId}/links`, {
      objectType: 'Meeting',
      objectId,
    });
  }
}
