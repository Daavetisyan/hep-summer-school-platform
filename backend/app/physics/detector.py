import random
from dataclasses import dataclass, asdict


PARTICLES = ["electron", "photon", "muon", "charged_pion", "neutral_hadron", "neutrino"]


@dataclass
class DetectorEvent:
    event_id: int
    true_particle: str
    tracker_hit: bool
    ecal_energy: float
    hcal_energy: float
    muon_hit: bool
    missing_energy: float
    explanation: str


def _noise(value: float, spread: float = 0.08) -> float:
    return max(0.0, round(random.gauss(value, max(value * spread, 0.2)), 2))


def generate_detector_event(event_id: int, particle: str | None = None) -> DetectorEvent:
    if particle is None:
        particle = random.choice(PARTICLES)

    if particle not in PARTICLES:
        raise ValueError(f"Unknown particle: {particle}")

    if particle == "electron":
        return DetectorEvent(
            event_id=event_id,
            true_particle=particle,
            tracker_hit=True,
            ecal_energy=_noise(random.uniform(25, 80)),
            hcal_energy=_noise(random.uniform(0, 5)),
            muon_hit=False,
            missing_energy=_noise(0),
            explanation="Electron: charged track plus large electromagnetic calorimeter energy."
        )

    if particle == "photon":
        return DetectorEvent(
            event_id=event_id,
            true_particle=particle,
            tracker_hit=False,
            ecal_energy=_noise(random.uniform(25, 80)),
            hcal_energy=_noise(random.uniform(0, 4)),
            muon_hit=False,
            missing_energy=_noise(0),
            explanation="Photon: no charged track, but large electromagnetic calorimeter energy."
        )

    if particle == "muon":
        return DetectorEvent(
            event_id=event_id,
            true_particle=particle,
            tracker_hit=True,
            ecal_energy=_noise(random.uniform(0, 4)),
            hcal_energy=_noise(random.uniform(0, 6)),
            muon_hit=True,
            missing_energy=_noise(0),
            explanation="Muon: charged track, little calorimeter energy, reaches muon system."
        )

    if particle == "charged_pion":
        return DetectorEvent(
            event_id=event_id,
            true_particle=particle,
            tracker_hit=True,
            ecal_energy=_noise(random.uniform(0, 10)),
            hcal_energy=_noise(random.uniform(20, 90)),
            muon_hit=False,
            missing_energy=_noise(0),
            explanation="Charged hadron: charged track and large hadronic calorimeter energy."
        )

    if particle == "neutral_hadron":
        return DetectorEvent(
            event_id=event_id,
            true_particle=particle,
            tracker_hit=False,
            ecal_energy=_noise(random.uniform(0, 8)),
            hcal_energy=_noise(random.uniform(20, 90)),
            muon_hit=False,
            missing_energy=_noise(0),
            explanation="Neutral hadron: no charged track and large hadronic calorimeter energy."
        )

    return DetectorEvent(
        event_id=event_id,
        true_particle="neutrino",
        tracker_hit=False,
        ecal_energy=_noise(0),
        hcal_energy=_noise(0),
        muon_hit=False,
        missing_energy=_noise(random.uniform(25, 90)),
        explanation="Neutrino candidate: no direct detector hits, visible as missing energy."
    )


def classify_event_rule_based(event: dict) -> str:
    tracker = bool(event["tracker_hit"])
    ecal = float(event["ecal_energy"])
    hcal = float(event["hcal_energy"])
    muon = bool(event["muon_hit"])
    missing = float(event["missing_energy"])

    if missing > 15 and ecal < 5 and hcal < 5 and not tracker and not muon:
        return "neutrino"
    if muon:
        return "muon"
    if ecal > 15 and tracker:
        return "electron"
    if ecal > 15 and not tracker:
        return "photon"
    if hcal > 15 and tracker:
        return "charged_pion"
    if hcal > 15 and not tracker:
        return "neutral_hadron"
    return "unknown"


def check_student_prediction(event: dict, prediction: str) -> tuple[bool, str]:
    true_particle = event["true_particle"]
    correct = prediction == true_particle
    if correct:
        return True, "Correct. Your classification matches the detector pattern."

    predicted_by_rules = classify_event_rule_based(event)
    return False, (
        f"Not quite. The true particle is {true_particle}. "
        f"A rule-based classifier would predict {predicted_by_rules}. "
        f"Look carefully at tracker hit, ECAL energy, HCAL energy, muon hit, and missing energy."
    )
