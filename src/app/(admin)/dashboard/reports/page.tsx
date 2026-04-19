"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/context/AppContext";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const COLORS = [
	"hsl(220, 60%, 20%)",
	"hsl(35, 90%, 55%)",
	"hsl(152, 60%, 40%)",
	"hsl(210, 80%, 55%)",
	"hsl(0, 72%, 51%)",
];

export default function DashboardReportsPage() {
	const { properties, leads, users } = useAppState();

	const typeBreakdown = properties.reduce(
		(acc, p) => {
			acc[p.type] = (acc[p.type] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);
	const typeData = Object.entries(typeBreakdown).map(([name, value]) => ({
		name,
		value,
	}));

	const statusBreakdown = properties.reduce(
		(acc, p) => {
			acc[p.status] = (acc[p.status] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);
	const statusData = Object.entries(statusBreakdown).map(([name, value]) => ({
		name,
		value,
	}));

	const agentPerformance = users
		.filter((u) => u.role === "Agent")
		.map((agent) => ({
			name: agent.name.split(" ")[0],
			listings: properties.filter((p) => p.agentName === agent.name).length,
			leads: leads.filter((l) => l.agent === agent.name).length,
		}));

	const handleExport = () => toast.success("Report exported as CSV!");

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading text-2xl font-bold">Reports & Analytics</h1>
					<p className="text-muted-foreground">
						Insights into your real estate business
					</p>
				</div>
				<Button variant="outline" onClick={handleExport}>
					<Download className="mr-2 h-4 w-4" />
					Export CSV
				</Button>
			</div>

			<div className="grid gap-4 sm:grid-cols-4">
				{[
					{ label: "Total Properties", value: properties.length },
					{ label: "Total Users", value: users.length },
					{ label: "Total Leads", value: leads.length },
					{
						label: "Conversion Rate",
						value: `${
							leads.length > 0
								? Math.round(
										(leads.filter((l) => l.status === "Closed").length /
											leads.length) *
											100,
									)
								: 0
						}%`,
					},
				].map((s) => (
					<Card key={s.label}>
						<CardContent className="p-6 text-center">
							<p className="font-heading text-3xl font-bold">{s.value}</p>
							<p className="text-sm text-muted-foreground">{s.label}</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="font-heading">Property Types</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={250}>
							<PieChart>
								<Pie
									data={typeData}
									cx="50%"
									cy="50%"
									outerRadius={90}
									paddingAngle={3}
									dataKey="value"
									label={({ name, value }) => `${name}: ${value}`}
								>
									{typeData.map((_, i) => (
										<Cell key={i} fill={COLORS[i % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="font-heading">Agent Performance</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={agentPerformance}>
								<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
								<XAxis
									dataKey="name"
									stroke="hsl(var(--muted-foreground))"
									fontSize={12}
								/>
								<YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "8px",
										color: "hsl(var(--foreground))",
									}}
								/>
								<Bar
									dataKey="listings"
									fill="hsl(220, 60%, 20%)"
									radius={[4, 4, 0, 0]}
								/>
								<Bar
									dataKey="leads"
									fill="hsl(35, 90%, 55%)"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="font-heading">Listing Status Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap justify-center gap-6 py-6">
							{statusData.map((s, i) => (
								<div key={s.name} className="text-center">
									<div
										className="font-heading text-4xl font-bold"
										style={{ color: COLORS[i % COLORS.length] }}
									>
										{s.value}
									</div>
									<Badge variant="outline" className="mt-2">
										{s.name}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
