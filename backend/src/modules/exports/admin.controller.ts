// src/modules/exports/admin.controller.ts

import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleRouteError, sendNotFound } from '@/modules/_shared';
import { repoGetCatalogFull } from '@/modules/catalogs/repository';
import { exportPdfParamsSchema, publishCatalogSchema, sendCatalogEmailSchema } from './validation';
import { buildCatalogHtml } from './pdf-template';
import { renderPdf } from './pdf-renderer';
import { sendCatalogEmail } from './mail-service';
import { listPublishTargets, publishCatalogToTargets } from './publish-service';

/**
 * POST /exports/pdf/:catalogId
 * Generates a PDF for the given catalog and returns it as a download.
 */
export async function handleExportPdf(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { catalogId } = exportPdfParamsSchema.parse(req.params);

    const catalog = await repoGetCatalogFull(catalogId);
    if (!catalog) return sendNotFound(reply);

    const html = buildCatalogHtml(catalog);
    const pdfBuffer = await renderPdf({ html });

    const filename = `${catalog.slug || 'catalog'}-${Date.now()}.pdf`;

    return reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .header('Content-Length', pdfBuffer.length)
      .send(pdfBuffer);
  } catch (e) {
    return handleRouteError(reply, req, e, 'export_pdf');
  }
}

/**
 * POST /exports/email/:catalogId
 * Generates a PDF and emails it to the specified recipient.
 */
export async function handleExportEmail(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { catalogId } = exportPdfParamsSchema.parse(req.params);
    const body = sendCatalogEmailSchema.parse(req.body);

    const catalog = await repoGetCatalogFull(catalogId);
    if (!catalog) return sendNotFound(reply);

    const html = buildCatalogHtml(catalog);
    const pdfBuffer = await renderPdf({ html });

    const filename = `${catalog.slug || 'catalog'}.pdf`;

    await sendCatalogEmail({
      to: body.to,
      subject: body.subject,
      message: body.message,
      catalogTitle: catalog.title,
      pdfBuffer,
      pdfFilename: filename,
    });

    return reply.status(200).send({ success: true, message: 'Email sent successfully' });
  } catch (e) {
    return handleRouteError(reply, req, e, 'export_email');
  }
}

/**
 * GET /exports/publish/targets
 * Yayinlanabilir tum aktif `database` tipi product source'lari listeler.
 */
export async function handleListPublishTargets(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const items = await listPublishTargets();
    return reply.send({ items });
  } catch (e) {
    return handleRouteError(reply, _req, e, 'list_publish_targets');
  }
}

/**
 * POST /exports/publish/:catalogId
 * Katalogu PDF olarak render eder, lokal storage'a yazar ve secilen
 * hedef kaynak DB'lerinin `library` tablolarina TASLAK olarak ekler.
 *   body: { target_slugs: string[] }
 *   yanit: { pdf_url, results: [{slug,name,ok,library_id?,error?}] }
 */
export async function handlePublishCatalog(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { catalogId } = exportPdfParamsSchema.parse(req.params);
    const { target_slugs } = publishCatalogSchema.parse(req.body ?? {});

    const catalog = await repoGetCatalogFull(catalogId);
    if (!catalog) return sendNotFound(reply);

    const html = buildCatalogHtml(catalog);
    const pdfBuffer = await renderPdf({ html });

    const result = await publishCatalogToTargets(catalog, pdfBuffer, target_slugs);
    return reply.status(200).send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, 'publish_catalog');
  }
}
