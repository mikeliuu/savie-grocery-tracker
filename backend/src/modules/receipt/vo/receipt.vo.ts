import { ApiProperty } from '@nestjs/swagger';
import { Receipt, VeryfiReceipt } from '../receipt.interface';

export class ReceiptVO {
  @ApiProperty()
  id: Receipt['id'];

  @ApiProperty()
  type: Receipt['type'];

  @ApiProperty()
  currency: Receipt['currency'];

  @ApiProperty()
  total: Receipt['total'];

  @ApiProperty()
  vendor: Receipt['vendor'];

  @ApiProperty()
  payment: Receipt['payment'];

  @ApiProperty()
  items: Receipt['items'];

  static toReceiptItems(receiptData: VeryfiReceipt): Receipt['items'] {
    return (
      receiptData?.line_items?.map((lineItem) => ({
        id: lineItem?.id ?? null,
        name: lineItem?.description ?? '',
        quantity: lineItem?.quantity ?? 0,
        price: lineItem?.price ?? 0,
        total: lineItem?.total ?? 0,
        date: lineItem?.date ?? '',
        type: lineItem?.type ?? null,
      })) || []
    );
  }

  static toReceiptVendor(receiptData: VeryfiReceipt): Receipt['vendor'] {
    return {
      name: receiptData?.vendor?.name ?? null,
      rawName: receiptData?.vendor?.raw_name ?? null,
      address: receiptData?.vendor?.address ?? null,
      storeNumber: receiptData?.store_number ?? null,
    };
  }

  static toReceiptPayment(receiptData: VeryfiReceipt): Receipt['payment'] {
    return {
      cardNumber: receiptData?.payment?.card_number ?? null,
      displayName: receiptData?.payment?.display_name ?? null,
      terms: receiptData?.payment?.terms ?? null,
      type: receiptData?.payment?.type ?? null,
    };
  }

  static toVO(receiptData: VeryfiReceipt): ReceiptVO {
    const vo = new ReceiptVO();

    vo.id = receiptData?.id || null;
    vo.type = receiptData?.document_type || null;
    vo.currency = receiptData?.currency_code || null;
    vo.total = receiptData?.total || null;
    vo.payment = ReceiptVO.toReceiptPayment(receiptData);
    vo.vendor = ReceiptVO.toReceiptVendor(receiptData);
    vo.items = ReceiptVO.toReceiptItems(receiptData);

    return vo;
  }
}
