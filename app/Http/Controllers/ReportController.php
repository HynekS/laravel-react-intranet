<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App;

class ReportController extends Controller
{
    public function generate_pdf(Request $request)
    {
        $date = date('j. n. Y', time());
        $image_url = public_path('images/demo-logo-no-address.jpg');

        $pdf = App::make('dompdf.wrapper');
        $pdf->loadHTML("
        <!DOCTYPE html>
        <html lang='cs_CZ'>
          <head>
            <meta charset='UTF-8' />
            <meta http-equiv='X-UA-Compatible' content='IE=edge' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <title>Expertní list</title>
            <style>
                html {
                    font-size: 100%;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: DejaVu Sans, sans-serif;
                    font-size: 8pt;
                    padding: 12pt 36pt 64pt 36pt;
                }
                h1 { margin-top 0; padding-top: 0; line-height: 1.5 }
                dt, dd {  display: inline-block;  }              
                dt { font-weight: bold; min-width: 40%;}
                .logo-wrapper {
                    margin: 0 auto;
                    width: 80%;
                }
                .logo {
                    width: 100%;
                    height: auto;
                }
                .notice {
                    border: 1px solid #333333;
                    font-size: 7pt;
                    padding: 8pt;
                }
                .footer {
                    position: fixed;
                    right: 36pt;
                    left: 36pt;
                    bottom: 0;
                    width: 90%;
                    border-top: 2px solid #333333;
                    padding: 8pt 0 24pt 0;
                }

                .footer span {
                    font-size: 7pt;
                    margin: 0;
                    display: block;
                }

                .text-center {
                    text-align: center;
                }
            </style>
          </head>
          <body>
            <div class='logo-wrapper'>
                <img class='logo' src='{$image_url}'/>
            </div>
            <h1 class='text-center'>Expertní list – dodatek ke stavební činosti</h1>
            <p class='notice'>
              Tato expertiza je určena pro stavebníka (investora) příslušné stavby jako
              doklad realizovaného záchranného výzkumu. Je tedy nedílnou součástí
              dokumentace zcela konkrétní stavební akce, a jako taková je v souvislosti
              s jinou stavební aktivitou neplatná. Stavebník (investor) danou expertizu
              předloží kontrolním orgánům při kolaudačním řízení.
            </p>
        
            <h2 class='text-center'>Identifikace akce:</h2>
            <dl>
              <dt>Název akce:</dt>
              <dd>{$request->nazev_akce}</dd>
            </dl>
        
            <dl>
                <dt>Lokalita:</dt>
                <dd>{$request->EL_lokalita}</dd>
            </dl>
        
            <dl>
                <dt>Okres a Kraj:</dt>
                <dd>{$request->okres}, {$request->kraj}</dd>
            </dl>

            <dl>
                <dt>GPS:</dt>
                <dd>(Temporarily omitted)</dd>
            </dl>

            <dl>
                <dt>Stavebník (investor stavby):</dt>
                <dd>(Temporarily omitted)</dd>
            </dl>
            
            <dl>
                <dt>Termín realizace kontrolních stavebních prací:</dt>
                <dd>{$request->EL_Termin}</dd>
            </dl>
            
            <dl>
                <dt>Forma archeologického výzkumu:</dt>
                <dd>{$request->EL_Forma}</dd>
            </dl>

            <h2 class='text-center'>Dokumentace</h2>
                
            <dl>
            <dt>Deníkový zápis:</dt>
            <dd>{$request->EL_Denik}</dd>
            </dl>

            <dl>
            <dt>Fotodokumentace:</dt>
            <dd>{$request->EL_fotodokumentace}</dd>
            </dl>

            <dl>
            <dt>Kresebná a textová dokumentace:</dt>
            <dd>{$request->EL_kresebna_a_textova}</dd>
            </dl>
            
            <h2 class='text-center'>Dokumentované archeologické nálezy:</h2>
            <p class='text-center'>{$request->EL_Dokumentovane}</p>

            <h2 class='text-center'>Movité archeologické nálezy:</h2>
            <p class='text-center'>{$request->EL_Movite}</p>

            <h2 class='text-center'>Popis:</h2>
            <p>{$request->EL_Popis}</p>
            
            <div>
            <dl>
                <dt>Datum:</dt>
                <dd>{$date}</dd>
            </dl>

            <dl>
            <dt>Vyhotovil:</dt>
            <dd><b>Mgr. Jan Novák</b></dd>
            </dl>

            <dl>
            <dt>razítko a podpis:</dt>
            <dd></dd>
            </dl>
           
            <div class='text-center footer'>
                <span>Oprávnění vydané Ministerstvem kultury ČR, č. j. MK L7542I20I0 OPP, IČO: 289 66 465</span>
                <span>Bankovní spojení: MONETA Money Bank, a.s., č. ú. 199406787/0600</span>
            </div>

           
          </body>
        </html>
        
        ");
        return $pdf->download('invoice.pdf');
    }
}
