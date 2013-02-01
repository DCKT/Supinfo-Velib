<?php

namespace Web\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Web\MainBundle\Entity\Favoris;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
	// Page d'accueil
    public function indexAction()
    {
        return $this->render('WebMainBundle:Default:index.html.twig');
    }

    // Page avec GMAP
    public function mapAction()
    {
        $favoris = new Favoris();

        $form = $this->createFormBuilder($favoris)
                        ->add('nomStation', 'text')
                        ->getForm();

    	return $this->render('WebMainBundle:Default:map.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    // Page avec favoris
    public function favorisAction()
    {

        // Current user
        $user = $this->container->get('security.context')->getToken()->getUser();
       
        $repo = $this->getDoctrine()->getManager()->getRepository('WebMainBundle:Favoris');

        $favoris = $repo->getUserFavori($user);

        return $this->render('WebMainBundle:Default:favoris.html.twig', array(
             'favoris' => $favoris
        ));
    }

    public function addFavoriAction()
    {
        $user = $this->container->get('security.context')->getToken()->getUser();
        $request = $this->get('request');

        if( $request->getMethod() == 'POST' )
        {
            $favoris = new Favoris();
            $nomStation = $_POST['form']['nomStation'];
            $favoris->setNomStation($nomStation);
            $favoris->addUser($user);

            $manager = $this->getDoctrine()->getManager();
            $manager->persist($favoris);
            $manager->flush();

            return new Response('Favoris ajouté');
        }
        else {
            return new Response('No');
        }
        
    }
}
