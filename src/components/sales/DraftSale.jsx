import React from 'react';
import { FileText, Edit, Trash2, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const DraftSale = ({ drafts = [], onEdit, onDelete, onConvert }) => {
  return (
    <div className="space-y-4">
      {drafts.length === 0 ? (
        <Card>
          <div className="text-center py-12"> 
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No draft sales found</p>
          </div>
        </Card>
      ) : (
        drafts.map((draft) => ( 
          <Card key={draft.id} className="hover:shadow-md transition-shadow">
            <div className="block md:flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{draft.draftNo}</h3>
                  <Badge variant="warning">Draft</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{draft.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{draft.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Items</p>
                    <p className="font-medium text-gray-900">{draft.itemCount} items</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-semibold text-blue-600">₹{draft.amount.toLocaleString()}</p>
                  </div>
                </div>

                {draft.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600 italic">{draft.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 mt-3 md:mt-0 ml-4">
                <Button size="sm" onClick={() => onEdit(draft)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => onConvert(draft)}>
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Convert
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(draft)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default DraftSale;