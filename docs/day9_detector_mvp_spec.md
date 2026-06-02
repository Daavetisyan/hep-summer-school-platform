# Day 9 Detector Simulator MVP Specification

## Learning objective

Students learn that invisible particles can be identified through detector traces and energy deposits.

## Detector signals

- `tracker_hit`: charged particle left a track
- `ecal_energy`: electromagnetic calorimeter energy
- `hcal_energy`: hadronic calorimeter energy
- `muon_hit`: particle reached muon detector
- `missing_energy`: possible neutrino-like event

## Particle logic

| Particle | Tracker | ECAL | HCAL | Muon hit | Missing energy |
|---|---:|---:|---:|---:|---:|
| electron | yes | high | low | no | low |
| photon | no | high | low | no | low |
| muon | yes | low | low | yes | low |
| charged pion | yes | low-medium | high | no | low |
| neutral hadron | no | low-medium | high | no | low |
| neutrino | no | low | low | no | high |

## Student task

1. Generate event.
2. Observe detector response.
3. Predict particle type.
4. Receive feedback.
5. Submit run for private progress tracking.

## Armenian teaching note

When explaining particle/calorimeter showers in Armenian, use «հեղեղ».
