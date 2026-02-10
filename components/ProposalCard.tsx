
import React, { useState, useEffect } from 'react';
import { Proposal, ProposalStatus } from '../types';
import { summarizeProposal } from '../services/geminiService';

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (id: string) => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onVote }) => {
  const [summary, setSummary] = useState<string>(proposal.aiSummary || '');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!summary) {
      setLoading(true);
      summarizeProposal(proposal.title, proposal.description).then(res => {
        setSummary(res);
        setLoading(false);
      });
    }
  }, [proposal]);

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.Validated: return 'bg-green-100 text-green-800';
      case ProposalStatus.Rejected: return 'bg-red-100 text-red-800';
      case ProposalStatus.InReview: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
          {proposal.status}
        </span>
        <span className="text-xs text-gray-400">{proposal.date}</span>
      </div>
      
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-1">{proposal.title}</h3>
        <p className="text-sm text-gray-500 italic">Por {proposal.author}</p>
      </div>

      <div className="bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-400">
        <p className="text-sm text-emerald-800 font-medium mb-1 flex items-center gap-1">
          ✨ Resumen IA:
        </p>
        <p className="text-sm text-emerald-700 leading-relaxed">
          {loading ? 'Generando resumen inteligente...' : summary}
        </p>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3">{proposal.description}</p>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 font-bold">{proposal.votes}</span>
          <span className="text-gray-400 text-xs uppercase">apoyos</span>
        </div>
        <button 
          onClick={() => onVote(proposal.id)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <span>👍</span> Apoyar
        </button>
      </div>
    </div>
  );
};

export default ProposalCard;
