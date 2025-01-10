import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';

// Replace with your own PDF component:
const MyDocument = () => <div>My PDF Document</div>;

export function ExamplePDF() {
	return (
		<div>
			<PDFDownloadLink
				document={<MyDocument />}
				fileName="example.pdf">
				{({ loading }) => (loading ? <span>Loading...</span> : <span>Download PDF</span>)}
			</PDFDownloadLink>
		</div>
	);
}
