/*eslinet-diable*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    FileImage,
    Upload,
    ShieldCheck,
    X,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { KYCUpload, getKycStatus } from "@/api/kyc";

type DocumentType =
    | "national_id"
    | "passport"
    | "drivers_license";

interface FileUploadProps {
    label: string;
    description: string;
    file: File | null;
    onChange: (file: File | null) => void;
}

function FileUpload({
    label,
    description,
    file,
    onChange,
}: FileUploadProps) {
    const handleFile = (selectedFile: File | undefined) => {
        if (!selectedFile) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            toast.error(
                "Please upload JPG, PNG, WEBP or PDF files."
            );
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB.");
            return;
        }

        onChange(selectedFile);
    };

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">
                {label}
            </Label>

            <label
                htmlFor={label}
                className={`group flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition ${file
                    ? "border-primary/50 bg-primary/5"
                    : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
                    }`}
            >
                {file ? (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>

                        <p className="mt-3 max-w-full truncate px-4 text-sm font-medium">
                            {file.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onChange(null);
                            }}
                            className="mt-3 inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                        >
                            <X className="h-3 w-3" />
                            Remove
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Upload className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
                        </div>

                        <p className="mt-3 text-sm font-medium">
                            Upload document
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            {description}
                        </p>
                    </>
                )}

                <Input
                    id={label}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                        handleFile(e.target.files?.[0])
                    }
                />
            </label>
        </div>
    );
}

export default function Kyc() {
    const navigate = useNavigate();
    const {
        data: kycResult,
        isLoading: kycLoading,
    } = useQuery({
        queryKey: ["kyc-status"],
        queryFn: getKycStatus,
    });
    const [documentType, setDocumentType] =
        useState<DocumentType>("national_id");

    const [frontFile, setFrontFile] =
        useState<File | null>(null);

    const [backFile, setBackFile] =
        useState<File | null>(null);

    const [selfieFile, setSelfieFile] =
        useState<File | null>(null);

    const kycMutation = useMutation({
        mutationFn: KYCUpload,

        onSuccess: (result) => {
            if (!result?.status) {
                toast.error(
                    result?.message ||
                    "KYC submission failed."
                );
                return;
            }

            toast.success(
                "Your KYC has been submitted successfully."
            );

            navigate("/profile");
        },

        onError: (error: Error) => {
            console.error(
                "KYC submission error:",
                error
            );

            toast.error(
                (error as any)?.response?.data?.message ||
                error?.message ||
                "Failed to submit KYC."
            );
        },
    });

    const handleSubmit = () => {
        if (!frontFile) {
            toast.error(
                "Please upload the front of your document."
            );
            return;
        }

        if (!backFile) {
            toast.error(
                "Please upload the back of your document."
            );
            return;
        }

        if (!selfieFile) {
            toast.error("Please upload a selfie.");
            return;
        }

        kycMutation.mutate({
            documentType,
            frontFile,
            backFile,
            selfieFile,
        });
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        disabled={kycMutation.isPending}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div>
                        <h1 className="font-semibold">
                            Identity Verification
                        </h1>

                        <p className="text-xs text-muted-foreground">
                            Verify your identity
                        </p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-2xl space-y-5 p-4">

                {/* Status */}
                {kycResult?.status === "pending" && (
                    <Card className="border-amber-500/30 bg-amber-500/5">
                        <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                                    <ShieldCheck className="h-6 w-6 text-amber-500" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-semibold">
                                            Verification under review
                                        </h2>

                                        <Badge variant="secondary">
                                            Pending
                                        </Badge>
                                    </div>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        We have received your identity documents.
                                        Our verification team is reviewing your
                                        information. This may take some time.
                                    </p>

                                    <p className="mt-3 text-xs text-muted-foreground">
                                        Submitted{" "}
                                        {kycResult.created_at
                                            ? new Date(
                                                kycResult.created_at
                                            ).toLocaleDateString()
                                            : ""}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Security information */}
                <div className="flex gap-3 rounded-xl border bg-muted/30 p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <div>
                        <p className="text-sm font-medium">
                            Your information is protected
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Upload clear and valid documents.
                            Your documents will only be used
                            for identity verification.
                        </p>
                    </div>
                </div>

                {kycResult?.status === "pending" ? <></> : <>
                    {/* Identity document */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Identity document
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            {/* Document type */}
                            <div className="space-y-2">
                                <Label>
                                    Document type
                                </Label>

                                <select
                                    value={documentType}
                                    disabled={kycMutation.isPending}
                                    onChange={(e) =>
                                        setDocumentType(
                                            e.target.value as DocumentType
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="national_id">
                                        National ID
                                    </option>

                                    <option value="passport">
                                        Passport
                                    </option>

                                    <option value="drivers_license">
                                        Driver's License
                                    </option>
                                </select>
                            </div>

                            {/* Front */}
                            <FileUpload
                                label="Document front"
                                description="JPG, PNG, WEBP or PDF • Max 10MB"
                                file={frontFile}
                                onChange={setFrontFile}
                            />

                            {/* Back */}
                            <FileUpload
                                label="Document back"
                                description="Upload the back side of your ID"
                                file={backFile}
                                onChange={setBackFile}
                            />
                        </CardContent>
                    </Card>

                    {/* Selfie */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Identity selfie
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <FileUpload
                                label="Selfie"
                                description="Take a clear photo of your face"
                                file={selfieFile}
                                onChange={setSelfieFile}
                            />
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Before submitting
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {[
                                "Your document must be valid and readable",
                                "Make sure all four corners are visible",
                                "Avoid blurry or dark photos",
                                "Your selfie should clearly show your face",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-3 text-sm"
                                >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                                    <span className="text-muted-foreground">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <Button
                        className="h-12 w-full"
                        onClick={handleSubmit}
                        disabled={kycMutation.isPending}
                    >
                        {kycMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting verification...
                            </>
                        ) : (
                            <>
                                <FileImage className="mr-2 h-4 w-4" />
                                Submit for verification
                            </>
                        )}
                    </Button>
                </>}
            </main>
        </div>
    );
}