<?php

namespace Web\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Favoris
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Web\MainBundle\Entity\FavorisRepository")
 */
class Favoris
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="nomStation", type="string", length=255)
     */
    private $nomStation;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set nomStation
     *
     * @param string $nomStation
     * @return Favoris
     */
    public function setNomStation($nomStation)
    {
        $this->nomStation = $nomStation;
    
        return $this;
    }

    /**
     * Get nomStation
     *
     * @return string 
     */
    public function getNomStation()
    {
        return $this->nomStation;
    }
}
