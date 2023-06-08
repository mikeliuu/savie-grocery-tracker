import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import { ReceiptVO } from './vo/receipt.vo';
import { ReceiptItem } from './receipt.interface';

@Injectable()
export class ReceiptService {
  constructor(private readonly httpService: HttpService) {}

  async uploadReceipt(file: Express.Multer.File): Promise<ReceiptVO> {
    const formData = new FormData();

    formData.append('file', Buffer.from(file.buffer), {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const veryfiResult = await this.httpService.axiosRef(
      'https://api.veryfi.com/api/v8/partner/documents',
      {
        method: 'POST',
        headers: {
          'Client-Id': process.env.VERYFI_CLIENT_ID,
          Authorization: `apikey ${process.env.VERYFI_USERNAME}:${process.env.VERYFI_API_KEY}`,
          'content-type': 'multipart/form-data',
        },
        data: formData,
      },
    );

    const receiptVo = ReceiptVO.toVO(veryfiResult?.data);

    if (receiptVo?.type !== 'receipt') {
      throw new BadRequestException(
        'Uploaded document is not valid. Please upload a receipt',
      );
    }

    //* group items by name & aggregate data
    const groupedItems = Object.values(
      receiptVo?.items?.reduce((acc, cur) => {
        if (!acc[cur?.name]) {
          acc[cur?.name] = cur;
        } else {
          acc[cur?.name].quantity += cur?.quantity;
          acc[cur?.name].total += cur?.total ?? 0;
          acc[cur?.name].price += cur?.price ?? 0;
        }

        return acc;
      }, []),
    );

    receiptVo.items = groupedItems;

    return receiptVo;
  }
}
