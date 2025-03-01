import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';

@Injectable()
export class MeetingBaasService {
  private readonly client: Axios;

  constructor() {
    this.client = new Axios({
      baseURL: 'https://api.meetingbaas.com/v1',
      headers: {
        Authorization: `Bearer ${'7e18676ee0c6321fe258cc068186738625d2c7e7ba0faed3ec15e7a7b5a049f8'}`,
      },
    });
  }

  async getTranscript(meetingId: string) {
    const response = await this.client.get(`/meetings/${meetingId}/transcript`);
    return JSON.parse(response.data);
  }
}
