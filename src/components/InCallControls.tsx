import { Volume2, VolumeX, Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface InCallControlsProps {
  onEndCall: () => void;
  callDuration?: string;
}

export const InCallControls = ({ onEndCall, callDuration = "0:00" }: InCallControlsProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  return (
    <Card className="shadow-strong border-2 border-primary bg-gradient-primary text-primary-foreground">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <p className="text-sm opacity-90 mb-1">Call in Progress</p>
          <p className="text-2xl font-bold">{callDuration}</p>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Button
            variant={isSpeakerOn ? "default" : "secondary"}
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            title={isSpeakerOn ? "Speaker On" : "Speaker Off"}
          >
            {isSpeakerOn ? (
              <Volume2 className="w-6 h-6" />
            ) : (
              <VolumeX className="w-6 h-6" />
            )}
          </Button>

          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Muted" : "Unmuted"}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={onEndCall}
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
