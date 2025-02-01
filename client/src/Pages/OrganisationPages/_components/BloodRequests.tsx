import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Types } from "mongoose"
import axiosInstance from "@/util/axiosInstance"
import { motion } from "framer-motion"

interface IBloodRequest {
    _id: string
    patientId: {
        _id: Types.ObjectId
        name: string
        email: string
        phoneNo?: string
    }
    quantity: string
    type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
    completed: boolean
    createdAt: string
    }

    const OrganizationBloodRequests = () => {
    const [requests, setRequests] = useState<IBloodRequest[]>([])

    useEffect(() => {
        fetchBloodRequests()
    }, [])

    const fetchBloodRequests = async () => {
        try {
        const { data } = await axiosInstance.get("/organisation/getBloodRequests")
        setRequests(data.data)
        } catch (error) {
        console.error("Error fetching blood requests:", error)
        }
    }

    const handleComplete = async (requestId: string) => {
        try {
        await axiosInstance.patch("/organisation/completeBloodRequest", { requestId })
        await fetchBloodRequests()
        } catch (error) {
        console.error("Error completing blood request:", error)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-base-200/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
            <CardTitle>Blood Requests</CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {requests.map((request) => (
                    <TableRow key={request._id}>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{request.patientId.name}</TableCell>
                    <TableCell>
                        {request.patientId.email}
                        {request.patientId.phoneNo && <br />}
                        {request.patientId.phoneNo}
                    </TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.completed ? "Completed" : "Pending"}</TableCell>
                    <TableCell>
                        {!request.completed && (
                        <Button
                            onClick={() => handleComplete(request._id)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Mark Completed
                        </Button>
                        )}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        </motion.div>
    )
}

export default OrganizationBloodRequests

