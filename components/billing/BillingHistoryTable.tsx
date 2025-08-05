// components/billing/BillingHistoryTable.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DownloadCloud } from "lucide-react";

const invoices = [
  { id: 'INV-2025-003', date: 'June 1, 2025', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2025-002', date: 'May 1, 2025', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2025-001', date: 'April 1, 2025', amount: '$29.00', status: 'Paid' },
];

export function BillingHistoryTable() {
    return (
        <Card className="bg-card/50 border-border">
            <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View and download your past invoices.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>{invoice.date}</TableCell>
                                <TableCell>{invoice.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={invoice.status === 'Paid' ? 'success' : 'secondary'}>{invoice.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <DownloadCloud className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
