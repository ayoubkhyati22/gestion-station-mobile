import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import type { RapportData } from '@/types';

export class PDFService {
  static generateReportHTML(
    rapport: RapportData,
    selectedDate: string,
    t: (key: string) => string
  ): string {
    const totalGeneral = rapport.totalEssence + rapport.totalGasoil + rapport.totalTPE + rapport.totalLavage;
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>${t('dailyReport')} - ${formatDate(selectedDate)}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
                line-height: 1.6;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #2563EB;
                padding-bottom: 20px;
            }
            .header h1 {
                color: #2563EB;
                margin: 0;
                font-size: 28px;
            }
            .header p {
                color: #666;
                margin: 5px 0;
                font-size: 16px;
            }
            .summary {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            .summary h2 {
                color: #2563EB;
                margin-top: 0;
                font-size: 20px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-bottom: 20px;
            }
            .stat-card {
                background: white;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #2563EB;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .stat-card.essence {
                border-left-color: #EF4444;
            }
            .stat-card.gasoil {
                border-left-color: #059669;
            }
            .stat-card.tpe {
                border-left-color: #7C3AED;
            }
            .stat-card.lavage {
                border-left-color: #0891B2;
            }
            .stat-value {
                font-size: 24px;
                font-weight: bold;
                margin: 5px 0;
            }
            .stat-title {
                color: #666;
                font-size: 14px;
            }
            .total-card {
                background: #2563EB;
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
            }
            .total-value {
                font-size: 32px;
                font-weight: bold;
                margin: 10px 0;
            }
            .detail-section {
                margin: 30px 0;
                page-break-inside: avoid;
            }
            .detail-section h3 {
                color: #2563EB;
                border-bottom: 1px solid #ddd;
                padding-bottom: 10px;
                font-size: 18px;
            }
            .detail-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            .detail-table th,
            .detail-table td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            .detail-table th {
                background-color: #f8f9fa;
                font-weight: bold;
                color: #333;
            }
            .detail-table td:last-child {
                text-align: right;
                font-weight: bold;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
            @media print {
                body { margin: 0; }
                .page-break { page-break-before: always; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${t('dailyReport')}</h1>
            <p>${t('date')}: ${formatDate(selectedDate)}</p>
            <p>${t('generatedOn')}: ${new Date().toLocaleString('fr-FR')}</p>
        </div>

        <div class="summary">
            <h2>${t('financialSummary')}</h2>
            <div class="stats-grid">
                <div class="stat-card essence">
                    <div class="stat-title">${t('essence')}</div>
                    <div class="stat-value">${rapport.totalEssence.toFixed(2)} ${t('dh')}</div>
                    <div class="stat-title">${rapport.ventesEssence.length} ${t('sales')}</div>
                </div>
                <div class="stat-card gasoil">
                    <div class="stat-title">${t('gasoil')}</div>
                    <div class="stat-value">${rapport.totalGasoil.toFixed(2)} ${t('dh')}</div>
                    <div class="stat-title">${rapport.ventesGasoil.length} ${t('sales')}</div>
                </div>
                <div class="stat-card tpe">
                    <div class="stat-title">${t('tpe')}</div>
                    <div class="stat-value">${rapport.totalTPE.toFixed(2)} ${t('dh')}</div>
                    <div class="stat-title">${rapport.ticketsTPE.length} ${t('tickets')}</div>
                </div>
                <div class="stat-card lavage">
                    <div class="stat-title">${t('lavage')}</div>
                    <div class="stat-value">${rapport.totalLavage.toFixed(2)} ${t('dh')}</div>
                    <div class="stat-title">${rapport.lavages.length} ${t('washes')}</div>
                </div>
            </div>
            <div class="total-card">
                <div>${t('generalTotal')}</div>
                <div class="total-value">${totalGeneral.toFixed(2)} ${t('dh')}</div>
            </div>
        </div>

        ${this.generateDetailSections(rapport, t)}

        <div class="footer">
            <p>${t('reportGeneratedBy')} ${t('stationManager')} - ${new Date().toLocaleString('fr-FR')}</p>
        </div>
    </body>
    </html>
    `;
  }

  private static generateDetailSections(rapport: RapportData, t: (key: string) => string): string {
    let sections = '';

    // Essence sales detail
    if (rapport.ventesEssence.length > 0) {
      sections += `
        <div class="detail-section">
            <h3>${t('gasolineSalesDetail')}</h3>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>${t('volume')}</th>
                        <th>${t('pricePerLiter')}</th>
                        <th>${t('total')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${rapport.ventesEssence.map(vente => `
                    <tr>
                        <td>${vente.volume} ${t('liters')}</td>
                        <td>${vente.prix_par_litre} ${t('dh')}/${t('liters')}</td>
                        <td>${vente.total.toFixed(2)} ${t('dh')}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
      `;
    }

    // Gasoil sales detail
    if (rapport.ventesGasoil.length > 0) {
      sections += `
        <div class="detail-section">
            <h3>${t('dieselSalesDetail')}</h3>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>${t('volume')}</th>
                        <th>${t('pricePerLiter')}</th>
                        <th>${t('total')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${rapport.ventesGasoil.map(vente => `
                    <tr>
                        <td>${vente.volume} ${t('liters')}</td>
                        <td>${vente.prix_par_litre} ${t('dh')}/${t('liters')}</td>
                        <td>${vente.total.toFixed(2)} ${t('dh')}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
      `;
    }

    // TPE tickets detail
    if (rapport.ticketsTPE.length > 0) {
      sections += `
        <div class="detail-section">
            <h3>${t('posTicketsDetail')}</h3>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>${t('clientName')}</th>
                        <th>${t('amount')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${rapport.ticketsTPE.map(ticket => `
                    <tr>
                        <td>${ticket.nom_client}</td>
                        <td>${ticket.montant.toFixed(2)} ${t('dh')}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
      `;
    }

    // Compteurs detail
    if (rapport.compteurs.length > 0) {
      sections += `
        <div class="detail-section">
            <h3>${t('volumesSoldMeters')}</h3>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>${t('pump')}</th>
                        <th>${t('fuelType')}</th>
                        <th>${t('volumeSold')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${rapport.compteurs.map(compteur => `
                    <tr>
                        <td>${t('pump')} ${compteur.pompe_numero}</td>
                        <td>${t(compteur.type)}</td>
                        <td>${compteur.volume_vendu.toFixed(2)} ${t('liters')}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
      `;
    }

    return sections;
  }

  static async generateAndSharePDF(
    rapport: RapportData,
    selectedDate: string,
    t: (key: string) => string
  ): Promise<void> {
    try {
      // Generate HTML content
      const htmlContent = this.generateReportHTML(rapport, selectedDate, t);

      // Create PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Create filename with date
      const fileName = `rapport_${selectedDate}.pdf`;
      const newPath = `${FileSystem.documentDirectory}${fileName}`;

      // Move file to permanent location
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      // Check if sharing is available
      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        // Share the file
        await Sharing.shareAsync(newPath, {
          mimeType: 'application/pdf',
          dialogTitle: t('shareReport') || 'Partager le rapport',
          UTI: 'com.adobe.pdf',
        });
      } else {
        throw new Error(t('sharingNotAvailable') || 'Partage non disponible');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }
}