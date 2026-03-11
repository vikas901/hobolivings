'use client';

import type { Property } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu';

interface OwnerPropertiesTableProps {
  properties: Property[];
  onView: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export function OwnerPropertiesTable({ properties, onView, onEdit, onDelete }: OwnerPropertiesTableProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-semibold">No Properties Found</h3>
        <p className="text-muted-foreground mt-2">Get started by listing your first property.</p>
      </div>
    );
  }
  
  const getStatusVariant = (status: 'approved' | 'pending' | 'rejected') => {
    switch (status) {
        case 'approved': return 'default';
        case 'pending': return 'secondary';
        case 'rejected': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Price (Starts at)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                 <Image
                    src={property.image}
                    alt={property.title}
                    width={64}
                    height={48}
                    className="rounded-md object-cover"
                  />
                  <span className='truncate max-w-xs'>{property.title}</span>
              </div>
            </TableCell>
            <TableCell>{property.category}</TableCell>
            <TableCell>{property.type}</TableCell>
            <TableCell className="text-right">₹{property.price.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(property.status)} className="capitalize">{property.status}</Badge>
            </TableCell>
            <TableCell>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(property)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(property)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(property)} className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
