export const WalletInfo = ({ balance, selectedWallet, onDisconnect }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Wallet</h3>
        {selectedWallet && (
          <button 
            onClick={onDisconnect}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Disconnect
          </button>
        )}
      </div>
      
      {selectedWallet ? (
        <>
          <div className="mb-2">
            <span className="text-sm text-gray-500">Name:</span>
            <p className="font-medium">{selectedWallet.name}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Available:</span>
              <p className="font-medium">
                {balance?.free ? parseFloat(balance.free).toFixed(2) : '0.10'} USDT
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Total:</span>
              <p className="font-medium">
                {balance ? (parseFloat(balance.free) + parseFloat(balance.locked)).toFixed(2) : '0.10'} USDT
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No wallet selected</p>
      )}
    </div>
  );
};