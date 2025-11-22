'use client';

import React, { useEffect } from 'react';
import { Button } from 'antd';
import { PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function MentoringPrintTemplatePage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-focus for print
    document.title = 'ទម្រង់ការចុះអប់រំ និងត្រួតពិនិត្យ - TaRL Pratham';
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print CSS */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: 'Hanuman', serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            background: white;
          }

          .print-page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            margin: 0 auto;
            background: white;
            box-sizing: border-box;
            page-break-after: always;
          }

          .print-page:last-child {
            page-break-after: auto;
          }

          h1 {
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15pt;
            border-bottom: 2pt solid #000;
            padding-bottom: 10pt;
          }

          h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 15pt;
            margin-bottom: 10pt;
            border-bottom: 1pt solid #333;
            padding-bottom: 5pt;
          }

          h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 12pt;
            margin-bottom: 8pt;
          }

          .field-row {
            margin-bottom: 8pt;
            display: flex;
            align-items: baseline;
          }

          .field-label {
            font-weight: bold;
            margin-right: 5pt;
            flex-shrink: 0;
          }

          .field-line {
            flex-grow: 1;
            border-bottom: 1pt dotted #000;
            min-height: 15pt;
          }

          .checkbox-group {
            margin: 8pt 0;
          }

          .checkbox-item {
            display: inline-block;
            margin-right: 15pt;
            margin-bottom: 5pt;
          }

          .checkbox-box {
            display: inline-block;
            width: 12pt;
            height: 12pt;
            border: 1pt solid #000;
            margin-right: 5pt;
            vertical-align: middle;
          }

          .text-area {
            width: 100%;
            min-height: 40pt;
            border: 1pt solid #000;
            margin-top: 5pt;
            padding: 5pt;
          }

          .activity-box {
            border: 2pt solid #000;
            padding: 10pt;
            margin: 10pt 0;
            page-break-inside: avoid;
          }

          .section {
            margin-bottom: 15pt;
          }

          .divider {
            border-top: 1pt solid #ccc;
            margin: 10pt 0;
          }
        }

        @media screen {
          body {
            background: #f0f0f0;
            padding: 20px;
          }

          .print-page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 0 auto 20px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            box-sizing: border-box;
          }

          h1 {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #000;
            padding-bottom: 10px;
            font-family: 'Hanuman', serif;
          }

          h2 {
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 15px;
            border-bottom: 2px solid #333;
            padding-bottom: 8px;
            font-family: 'Hanuman', serif;
          }

          h3 {
            font-size: 16px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 10px;
            font-family: 'Hanuman', serif;
          }

          .field-row {
            margin-bottom: 12px;
            display: flex;
            align-items: baseline;
            font-family: 'Hanuman', serif;
          }

          .field-label {
            font-weight: bold;
            margin-right: 8px;
            flex-shrink: 0;
          }

          .field-line {
            flex-grow: 1;
            border-bottom: 1px dotted #000;
            min-height: 20px;
          }

          .checkbox-group {
            margin: 12px 0;
            font-family: 'Hanuman', serif;
          }

          .checkbox-item {
            display: inline-block;
            margin-right: 20px;
            margin-bottom: 8px;
          }

          .checkbox-box {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #000;
            margin-right: 8px;
            vertical-align: middle;
          }

          .text-area {
            width: 100%;
            min-height: 60px;
            border: 1px solid #000;
            margin-top: 8px;
            padding: 8px;
          }

          .activity-box {
            border: 3px solid #000;
            padding: 15px;
            margin: 15px 0;
            background: #fafafa;
          }

          .section {
            margin-bottom: 20px;
          }

          .divider {
            border-top: 1px solid #ccc;
            margin: 15px 0;
          }
        }
      `}</style>

      {/* No-print controls */}
      <div className="no-print" style={{
        maxWidth: '210mm',
        margin: '0 auto 20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          size="large"
        >
          ត្រឡប់ក្រោយ
        </Button>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          size="large"
        >
          បោះពុម្ពទម្រង់ (Print Template)
        </Button>
      </div>

      {/* PAGE 1 */}
      <div className="print-page">
        <h1>ទម្រង់ការចុះអប់រំ និងត្រួតពិនិត្យ<br/>TaRL Mentoring Visit Form</h1>

        {/* SECTION 1: Visit Details */}
        <div className="section">
          <h2>១. ព័ត៌មានលម្អិតអំពីការចុះ (Visit Details)</h2>

          <div className="field-row">
            <span className="field-label">អ្នកណែនាំ (Mentor):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">សាលា (School):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">គ្រូបង្រៀន (Teacher):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">កាលបរិច្ឆេទ (Date):</span>
            <span className="field-line" style={{ maxWidth: '150px' }}></span>
            <span className="field-label" style={{ marginLeft: '20px' }}>ម៉ោង (Time):</span>
            <span className="field-line" style={{ maxWidth: '100px' }}></span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">ថ្នាក់ (Grade Group):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ថ្នាក់ទី៤ (Grade 4)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ថ្នាក់ទី៥ (Grade 5)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទាំងពីរ (Both)
            </div>
          </div>

          <div className="checkbox-group">
            <div className="field-label">មុខវិជ្ជា (Subject Observed):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ភាសា (Language)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> គណិតវិទ្យា (Math)
            </div>
          </div>
        </div>

        {/* SECTION 2: Class Status */}
        <div className="section">
          <h2>២. ស្ថានភាពថ្នាក់រៀន (Class Status)</h2>

          <div className="checkbox-group">
            <div className="field-label">ថ្នាក់រៀនកំពុងដំណើរការ? (Class in session?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">បើទេ ហេតុផល (If No, reason):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">សិស្សសរុប (Total students enrolled):</span>
            <span className="field-line" style={{ maxWidth: '80px' }}></span>
            <span className="field-label" style={{ marginLeft: '20px' }}>សិស្សមកវត្តមាន (Students present):</span>
            <span className="field-line" style={{ maxWidth: '80px' }}></span>
          </div>

          <div className="field-row">
            <span className="field-label">ថ្នាក់រៀនធ្លាប់ធ្វើពីមុន (Classes conducted before):</span>
            <span className="field-line" style={{ maxWidth: '80px' }}></span>
          </div>
        </div>

        {/* SECTION 3: Delivery Questions */}
        <div className="section">
          <h2>៣. សំណួរអំពីការបង្រៀន (Delivery Questions)</h2>

          <div className="checkbox-group">
            <div className="field-label">ថ្នាក់រៀនចាប់ផ្តើមត្រូវម៉ោង? (Class started on time?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">បើទេ ហេតុផល (If No, reason):</span>
            <span className="field-line"></span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">ប្រដាប់បង្រៀនដែលប្រើប្រាស់ (Teaching materials used):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> សៀវភៅសិក្សា
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ក្រដាសធម្មតា
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ក្រដាសខៀន
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ប៊ិច/ខ្មៅដៃ
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បន្ទះខៀន
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> រូបភាព
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ប្រដាប់លេងការសិក្សា
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> កុំព្យូទ័រ/ថេប្លេត
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> វីដេអូ
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> អ្វីផ្សេងទៀត: <span className="field-line" style={{ display: 'inline-block', width: '150px' }}></span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Classroom Organization */}
        <div className="section">
          <h2>៤. ការរៀបចំថ្នាក់រៀន (Classroom Organization)</h2>

          <div className="checkbox-group">
            <div className="field-label">សិស្សត្រូវបានចាត់តាមកម្រិត? (Students grouped by level?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="checkbox-group">
            <div className="field-label">សិស្សសកម្មចូលរួម? (Students actively participating?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>
        </div>

        {/* SECTION 5: Teacher Planning */}
        <div className="section">
          <h2>៥. ផែនការរបស់គ្រូ (Teacher Planning)</h2>

          <div className="checkbox-group">
            <div className="field-label">គ្រូមានផែនការសិក្សា? (Teacher has lesson plan?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">បើទេ ហេតុផល (If No, reason):</span>
            <span className="field-line"></span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">អនុវត្តតាមផែនការ? (Followed lesson plan?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">បើទេ ហេតុផល (If No, reason):</span>
            <span className="field-line"></span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">ផែនការសមស្របនឹងកម្រិតសិស្ស? (Plan appropriate for student levels?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2 - ACTIVITIES */}
      <div className="print-page">
        <h1>៦. សកម្មភាព (Activities)</h1>

        {/* ACTIVITY 1 */}
        <div className="activity-box">
          <h3>សកម្មភាពទី១ (Activity 1)</h3>

          <div className="checkbox-group">
            <div className="field-label">ប្រភេទសកម្មភាព (Activity Type):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការអាន (Reading)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការសរសេរ (Writing)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> គណិតវិទ្យា (Math)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការលេង (Games)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការពិភាក្សាក្រុម (Group discussion)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការបង្រៀនផ្ទាល់ខ្លួន (Individual teaching)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការអនុវត្តជាក្រុម (Group practice)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការប្រកួតប្រជែង (Competition)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> អ្វីផ្សេងទៀត (Other): <span className="field-line" style={{ display: 'inline-block', width: '100px' }}></span>
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">ឈ្មោះសកម្មភាពភាសា (Language activity name):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">ឈ្មោះសកម្មភាពគណិត (Math activity name):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">រយៈពេល (Duration):</span>
            <span className="field-line" style={{ maxWidth: '80px' }}></span>
            <span style={{ marginLeft: '5px' }}>នាទី (minutes)</span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">សេចក្តីណែនាំច្បាស់? (Clear instructions?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">បើទេ ហេតុផល (If No, reason):</span>
            <span className="field-line"></span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">បានបង្ហាញ? (Demonstrated?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="checkbox-group">
            <div className="field-label">អនុវត្តតាមដំណើរការ? (Followed process?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">បើទេ ហេតុផល (If No, reason):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">ការងារបុគ្គល (Individual work):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">ក្រុមតូច (Small groups):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">សិស្សអនុវត្ត (Students practice):</span>
            <span className="field-line"></span>
          </div>
        </div>

        {/* ACTIVITY 2 */}
        <div className="activity-box">
          <h3>សកម្មភាពទី២ (Activity 2)</h3>

          <div className="checkbox-group">
            <div className="field-label">ប្រភេទសកម្មភាព (Activity Type):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការអាន
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការសរសេរ
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> គណិតវិទ្យា
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការលេង
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការពិភាក្សាក្រុម
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការបង្រៀនផ្ទាល់ខ្លួន
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការអនុវត្តជាក្រុម
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការប្រកួតប្រជែង
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> អ្វីផ្សេងទៀត: <span className="field-line" style={{ display: 'inline-block', width: '100px' }}></span>
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">ឈ្មោះសកម្មភាពភាសា (Language activity name):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">ឈ្មោះសកម្មភាពគណិត (Math activity name):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">រយៈពេល (Duration):</span>
            <span className="field-line" style={{ maxWidth: '80px' }}></span>
            <span style={{ marginLeft: '5px' }}>នាទី (minutes)</span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">សេចក្តីណែនាំច្បាស់? (Clear instructions?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">បើទេ ហេតុផល (If No, reason):</span>
            <span className="field-line"></span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">បានបង្ហាញ? (Demonstrated?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="checkbox-group">
            <div className="field-label">អនុវត្តតាមដំណើរការ? (Followed process?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">បើទេ ហេតុផល (If No, reason):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">ការងារបុគ្គល (Individual work):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">ក្រុមតូច (Small groups):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">សិស្សអនុវត្ត (Students practice):</span>
            <span className="field-line"></span>
          </div>
        </div>
      </div>

      {/* PAGE 3 - ACTIVITY 3 & OBSERVATIONS */}
      <div className="print-page">
        {/* ACTIVITY 3 */}
        <div className="activity-box">
          <h3>សកម្មភាពទី៣ (Activity 3)</h3>

          <div className="checkbox-group">
            <div className="field-label">ប្រភេទសកម្មភាព (Activity Type):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការអាន
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការសរសេរ
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> គណិតវិទ្យា
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការលេង
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការពិភាក្សាក្រុម
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការបង្រៀនផ្ទាល់ខ្លួន
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការអនុវត្តជាក្រុម
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ការប្រកួតប្រជែង
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> អ្វីផ្សេងទៀត: <span className="field-line" style={{ display: 'inline-block', width: '100px' }}></span>
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">ឈ្មោះសកម្មភាពភាសា (Language activity name):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">ឈ្មោះសកម្មភាពគណិត (Math activity name):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">រយៈពេល (Duration):</span>
            <span className="field-line" style={{ maxWidth: '80px' }}></span>
            <span style={{ marginLeft: '5px' }}>នាទី (minutes)</span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">សេចក្តីណែនាំច្បាស់? (Clear instructions?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">បើទេ ហេតុផល (If No, reason):</span>
            <span className="field-line"></span>
          </div>

          <div className="checkbox-group">
            <div className="field-label">បានបង្ហាញ? (Demonstrated?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>

          <div className="field-row">
            <span className="field-label">ការងារបុគ្គល (Individual work):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">ក្រុមតូច (Small groups):</span>
            <span className="field-line"></span>
          </div>

          <div className="field-row">
            <span className="field-label">សិស្សអនុវត្ត (Students practice):</span>
            <span className="field-line"></span>
          </div>
        </div>

        <div className="divider"></div>

        {/* SECTION 7: Observations & Feedback */}
        <div className="section">
          <h2>៧. សង្កេត និងមតិ (Observations & Feedback)</h2>

          <div style={{ marginBottom: '15px' }}>
            <div className="field-label">សង្កេតទូទៅ (General Observations):</div>
            <div className="text-area"></div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div className="field-label">មតិលើគ្រូ (Teacher Feedback):</div>
            <div className="text-area"></div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div className="field-label">ផែនការសកម្មភាព (Action Plan):</div>
            <div className="text-area"></div>
          </div>

          <div className="checkbox-group">
            <div className="field-label">តម្រូវការតាមដាន? (Follow-up required?):</div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> បាទ/ចាស (Yes)
            </div>
            <div className="checkbox-item">
              <span className="checkbox-box"></span> ទេ (No)
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Signature Section */}
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '45%' }}>
              <div className="field-row">
                <span className="field-label">ហត្ថលេខាអ្នកណែនាំ (Mentor Signature):</span>
              </div>
              <div className="field-line" style={{ marginTop: '30px', borderBottom: '1pt solid #000' }}></div>
            </div>
            <div style={{ width: '45%' }}>
              <div className="field-row">
                <span className="field-label">ហត្ថលេខាគ្រូ (Teacher Signature):</span>
              </div>
              <div className="field-line" style={{ marginTop: '30px', borderBottom: '1pt solid #000' }}></div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '10pt', color: '#666' }}>
          <p>TaRL Pratham - Teaching at the Right Level</p>
          <p>ទម្រង់ការចុះអប់រំ និងត្រួតពិនិត្យ | Mentoring Visit Form</p>
        </div>
      </div>
    </>
  );
}
